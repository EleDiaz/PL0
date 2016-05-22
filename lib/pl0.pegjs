  /*
 * PEGjs for a "Pl-0" like language
 * Used in ULL PL Grado de Informática classes
 */

/*

Notas: Para los let se debe permitir destructuring para hacer if bonitos y tal
       entre otras cosas

*/
{
  "use strict";
  var ADT = require('./adt');

  var tree = function(f, r) {
    if (r.length > 0) {
      var last = r.pop();
      var result = new ADT.Operation(location(),
              { type: "Operation"
              , operand: last[0]
              , right: last[1]
              , left: tree(f,r)
              });
    }
    else {
      var result = f;
    }
    return result;
  }
}

program
    = decls:declaration+ {
        return new ADT.Program(location(),
                { type: "Program"
                , sequence: decls
                })
    }


declaration "declaration of var, const or function"
    = // Variable Declaration
      variable
    / // Constant Declaration
      constant
    / // Function Declaration with brackets syntax
      FUNCTION name:NAMEID DOTS ps:(paramType)+ RARROW ret:TYPE
               c:inlineComment?
               e:compoundExpr {
        return new ADT.FunctionDecl(location(),
                { type: "Function"
                , name: name
                , params: ps
                , returns: ret
                , comment: c
                , block: e });
    }


variable "variable"
    = LETMUT param:paramType ASSIGN e:expr c:inlineComment? {
        return new ADT.Variable(location(),
                { type: "Variable"
                , name: param.name
                , type: param.type
                , comment: c
                , block: e
                });
    }


constant "constant"
    = LET param:paramType ASSIGN e:expr c:inlineComment? {
        return new ADT.Constant(location(),
                { type: "Constant"
                , name: param.name
                , type: param.type
                , comment: c
                , block: e
                });
    }

paramType = _ id:NAMEID DOTS rtype:TYPE _ {
        return new ADT.Identifier(location(),
                { type: "Identifier"
                , name: id
                , realType: rtype
                });
    }

expr "Expresion??"
    = // Factor with basic operations
      cond
      // Variable
    / variable
      // Constant
    / constant
      // If Then Else
    / IF c:expr THEN t:compoundExpr ELSE f:compoundExpr {
        return new ADT.IfThenElse(location(),
                { type: "IfThenElse"
                , cond: c
                , trueCase: t
                , falseCase: f
                });
    }
      // If Then
    / IF c:expr THEN t:compoundExpr {
        return new ADT.IfThen(location(),
                { type: "IfThen"
                , cond: c
                , trueCase: t
                });
    }
      // While loop use a expr to get condition
    / WHILE e:expr b:compoundExpr {
        return new ADT.While(location(),
                { type: "While"
                , cond: e
                , block: b
                });
    }
      // Infinite loop
    / LOOP b:compoundExpr {
        return new ADT.Loop(location(),
                { type: "LOOP"
                , block: b
                });
    }
      // Map loop over a data structure iterable
    / MAP iter:expr RARROW element:NAMEID b:compoundExpr {
        return new ADT.Map(location(),
                { type: "Map"
                , iterator: iter
                , element: element
                , block: b
                });
    }
      // Assign expresion to a variable previously declared
    / !RESERVED id:NAMEID ASSIGN e:expr {
        return new ADT.Assign(location(),
                { type: "Assign"
                , name: id
                , block: e
                })
    }
      // Apply of function
    / !RESERVED id:NAMEID
            LEFTPAR !COMMA
                e:compoundExpr? (COMMA compoundExpr)*
            RIGHTPAR {
        let t = e ? [e] : [];
        return new ADT.Apply(location(),
                { type: "Apply"
                , name: id
                , params: t.concat(r.map(([_, exp]) => exp))
                })
    }
      // Identifier
    / !RESERVED id:NAMEID {
        return new ADT.Identifier(location(),
                { type: "Identifier"
                , name: id
                });
    }
    / // Parens
    LEFTPAR e:expr RIGHTPAR {
        return e;
    }


compoundExpr "Compound several expresion in one"
    = // Function Declaration with "haskell do" syntax (experimental)
      DO (expr __* EOL)+ "end" // Tener en cuenta la indentacion!!! una pila de indentacion?
    / // Clasical brackets to envolve a expresion
    LBRACKET sequence:expr* RBRACKET {
        return new ADT.Compound(location(),
                { type: "Compound"
                , sequence: sequence
                });
    }


cond "conditional"
    = l:exp op:COMP r:exp {
        console.log("ffdasdfsdfdf")
        return new ADT.Operation(location(),
                { type: "Operation"
                , operand: op
                , left: l
                , right: r
                });
      }
     / exp


exp
    = t:term   r:(ADD term)*   { return tree(t,r); }


term
    = f:factor r:(MUL factor)* { return tree(f,r); }


factor "factor(number, identifier, parens)"
    = n:NUMBER {
        return new ADT.Literal(location(),
                { type: "Literal"
                , value: n
                , primitiveType: "Int"
                });
    }
    / c:CHAR {
        return new ADT.Literal(location(),
                { type: "Literal"
                , value: c
                , primitiveType: "Char"
                });
    }
    / _ '"' str:$literalString* '"' _ {
        return new ADT.Literal(location(),
                { type: "Literal"
                , value: str
                , primitiveType: "String"
                });
    }
    / RSQUARE !COMMA fst:expr? rest:(COMMA expr)* LSQUARE {
        return new ADT.Literal(location(),
                { type: "Literal"
                , value: fst ? [fst].concat(rest.map(([_, exp]) => exp)) : []
                , primitiveType: "Array"
                });
    }

literalString
    = !('"' / '\\') a:. { return a; }
    / '\\' v:. { return v; } // TODO:

inlineComment = _ '"' v:$literalString* '"' _ { return v }

_ "whitespace" = $[ \t\n\r]*

__ "Horizontal Space" = $[ \t]

EOL = $[\n\r]


// Tokens
NAMEID        = _ id:$([a-z_][a-zA-Z_0-9']*) _ { return id }
TYPE          = _ id:$([A-Z_][a-zA-Z_0-9']*) _ { return id }
CHAR          = _ "'" c:. "'" _ { return c }
// Reserved words
RESERVED = (FUNCTION / LET / LETMUT / IF / ELSE / THEN / WHILE / DO / LOOP / MAP)

FUNCTION      = _ "fun" _ { return "fun"; }
DOTS          = _ ":" _   { return ":" }
COMMA         = _ "," _   { return "," }
RARROW        = _ "->" _  { return "->" }
LET           = _ "let" _ { return "let" }
LETMUT        = _ LET "mut" _ { return "let mut" }
ASSIGN        = _ '=' _   { return "=" }
IF            = _ "if" _  { return "if" }
THEN          = _ "then" _ { return "then" }
ELSE          = _ "else" _ { return "else" }
WHILE         = _ "while" _ { return "while" }
DO            = _ "do" _ { return "do" }
LOOP          = _ "loop" _ { return "loop" }
MAP           = _ "map" _  { return "map" }

LEFTPAR       = _ "(" _ { return "(" }
RIGHTPAR      = _ ")" _ { return ")" }
LBRACKET      = _ "{" _ { return "" } // There are problem with its
RBRACKET      = _ "}" _ { return "" }
LSQUARE       = _ "[" _ { return "[" }
RSQUARE       = _ "]" _ { return "]" }

ADD           = _ op:[+-] _ { return op; }
MUL           = _ op:[*/] _ { return op; }
COMP          = _ op:("=="/"!="/"<="/">="/"<"/">") _ {
               return op;
            }

ID            = _ id:$([a-zA-Z_][a-zA-Z_0-9]*) _
            {
              return id;
            }
NUMBER        = _ digits:$[0-9]+ _
            {
              return parseInt(digits, 10);
            }
