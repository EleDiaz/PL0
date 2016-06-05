  /*
 * PEGjs for a "Pl-0" like language
 * Used in ULL PL Grado de Informática classes
 */

/*

Notas: Para los let se debe permitir destructuring para hacer if bonitos y tal
       entre otras cosas

TODO: El bucle Map quizas se deberia llamar for, foreach, o por el estilo para
      suavizar la curva de apredizaje

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
                  , right: last[2]
                  , left: tree(f,r)
                  });
        }
        else {
            var result = f;
        }
        return result;
    }

    var operators = {
        "**": { precedence: 8, associativity: "left" }, // Pow
        "*": { precedence: 7, associativity: "left" }, // Multiplication
        "/": { precedence: 7, associativity: "left" }, // Divition
        "%": { precedence: 7, associativity: "left" }, // Remainder
        "+": { precedence: 6, associativity: "left" },
        "-": { precedence: 6, associativity: "left" },
        "++": { precedence: 5, associativity: "right" }, // Concat strings
        "==": { precedence: 4, associativity: "left" },
        "!=": { precedence: 4, associativity: "left" },  // Different
        "/=": { precedence: 4, associativity: "left" },  // Different
        "<": { precedence: 4, associativity: "left" },
        ">": { precedence: 4, associativity: "left" },
        "<=": { precedence: 4, associativity: "left" },
        ">=": { precedence: 4, associativity: "left" },
        "&&": { precedence: 3, associativity: "right" }, // Logic operators
        "||": { precedence: 3, associativity: "right" }
    }

    var getPrecedence = (op) => {
        if (operators[op]) {
            return operators[op].precedence;
        }
        else {
            return false;
        }
    }


    var comments = [];

}

program
    = decls:declaration+ {
        return new ADT.Program(location(),
                { type: "Program"
                , sequence: decls
                , comments: comments
                })
    }


declaration "declaration of var, const or function"
    = // Variable Declaration
      variable
    / // Constant Declaration
      constant
    / function

function "function"
    = // Function Declaration with brackets syntax
      FUNCTION name:NAMEID LEFTPAR ps:paramType* RIGHTPAR ret:(RARROW TYPE)?
               c:inlineComment?
               e:compoundExpr {
        return new ADT.FunctionDecl(location(),
                { type: "Function"
                , name: name
                , params: ps
                , returns: ret? ret[1] : null // TODO: Return Any? or null
                , comment: c
                , block: e });
    }


variable "variable"
    = LETMUT param:paramType ASSIGN e:expr {
        return new ADT.Variable(location(),
                { type: "Variable"
                , name: param.name
                , realType: param.realType
                , block: e
                });
    }


constant "constant"
    = LET param:paramType ASSIGN e:expr {
        return new ADT.Constant(location(),
                { type: "Constant"
                , name: param.name
                , realType: param.realType
                , block: e
                });
    }

paramType = _ id:NAMEID rtype:(DOTS TYPE)? _ {
        return new ADT.Identifier(location(),
                { type: "Identifier"
                , name: id
                , realType: rtype ? rtype[1] : null
                });
    }

expr "Expresion??"
    = // Operator to factors
      level0
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
    / FOR element:NAMEID LARROW iter:expr b:compoundExpr {
        return new ADT.For(location(),
                { type: "For"
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
      // Addiction of lambda expresion
    / LAMBDA param:paramType+ RARROW e:expr {
        return new ADT.Lambda(location(),
                { type: "Lambda"
                , params: param
                , block: e
                })
    }


compoundExpr "Compound several expresion in one"
      // Function Declaration with "haskell do" syntax (experimental)
      // Hacer un lenguaje sensitivo a la indentacion lleva a trucar la gramatica y llevar un fuerte
      // control de cuando ocurre un salto de linea
      // Hay que tener una pila de indentación que indique los distintos niveles de indentación
      // desde donde se encuentra el parseando. Hacer comparaciones para determinar si disminuye o aumenta
      //DO (expr __* EOL)+ "end"
    = // Clasical brackets to envolve a expresion
    LBRACKET sequence:expr* RBRACKET {
        return new ADT.Compound(location(),
                { type: "Compound"
                , sequence: sequence
                });
    }

// Levels of precedence
level0 = l:level1 rest:(op:OP &{return getPrecedence(op)==0} level0)* { return tree(l, rest); }
level1 = l:level2 rest:(op:OP &{return getPrecedence(op)==1} level1)* { return tree(l, rest); }
level2 = l:level3 rest:(op:OP &{return getPrecedence(op)==2} level2)* { return tree(l, rest); }
level3 = l:level4 rest:(op:OP &{return getPrecedence(op)==3} level3)* { return tree(l, rest); }
level4 = l:level5 rest:(op:OP &{return getPrecedence(op)==4} level4)* { return tree(l, rest); }
level5 = l:level6 rest:(op:OP &{return getPrecedence(op)==5} level5)* { return tree(l, rest); }
level6 = l:level7 rest:(op:OP &{return getPrecedence(op)==6} level6)* { return tree(l, rest); }
level7 = l:level8 rest:(op:OP &{return getPrecedence(op)==7} level7)* { return tree(l, rest); }
level8 = l:level9 rest:(op:OP &{return getPrecedence(op)==8} level8)* { return tree(l, rest); }
level9 = l:factor rest:(op:OP &{return getPrecedence(op)==9} level9)* { return tree(l, rest); }


// Factor
factor "factor(number, identifier, parens)"
    = n:NUMBER {
        return new ADT.Literal(location(),
                { type: "Literal"
                , value: n
                , primitiveType: "Int"
                });
    }
    / _ boolean:(FALSE / TRUE) _ {
        return new ADT.Literal(location(),
                { type: "Literal"
                , value: boolean
                , primitiveType: "Bool"
                })
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
    / LSQUARE !COMMA fst:expr? rest:(COMMA expr)* RSQUARE {
        return new ADT.Literal(location(),
                { type: "Literal"
                , value: fst ? [fst].concat(rest.map(([_, exp]) => exp)) : []
                , primitiveType: "Array"
                });
    }
      // Apply of function
    / !RESERVED id:NAMEID
            LEFTPAR !COMMA
                e:expr? r:(COMMA expr)*
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
      // Parens
    / LEFTPAR e:expr RIGHTPAR {
        return e;
    }

literalString
    = !('"' / '\\') a:. { return a; }
    / '\\' v:. { return v; } // TODO:

inlineComment = _ '"' v:$literalString* '"' _ { return v }

type = TYPE MINOR type GREATER
     / TYPE


_ "whitespace"
    = [ \t\n\r]* "//" comment:(!"\n" .)* "\n"? _ { comments.push({ type:"simple", comment: comment.map((x) => x[1]).join(""), location: location() }) }
    / [ \t\n\r]* "/*" comment:(!"\*/" .)* "*/" _ { comments.push({ type:"multiline", comment: comment.map((x) => x[1]).join(""), location: location()}) }
    / $[ \t\n\r]*

multilineComment
    = !("*/") v:. { return v}
    / [\n\r]

__ "Horizontal Space" = $[ \t]

EOL = $[\n\r]


// Tokens
NAMEID        = _ id:$([a-z_][a-zA-Z_0-9']*) _ { return id }
TYPE          = _ id:$([A-Z_][a-zA-Z_0-9']*) _ { return id }
CHAR          = _ "'" c:. "'" _                { return c }
OP            = _ !("//" / "/*" / "*/")op:$[-+=*/&%$!@?^:_<>]+    _ { return op }
// Reserved words
RESERVED = (FUNCTION / LET / LETMUT / IF / ELSE / THEN / WHILE / DO / LOOP / FOR / FALSE / TRUE)

BREACK        = _ "breack" _ { return "TODO" }
TRUE          = _ ("True" / "true") _ { return true; }
FALSE         = _ ("False" / "false") _ { return false; }
FUNCTION      = _ "fun" _ { return "fun" }
MINOR         = _ "<" _   { return "<" }
GREATER       = _ ">" _   { return ">" }
DOTS          = _ ":" _   { return ":" }
COMMA         = _ "," _   { return "," }
LAMBDA        = _ ("\\" / "λ") _   { return "\\" }
RARROW        = _ ("->" / "→") _  { return "->" }
LARROW        = _ ("<-" / "←") _  { return "->" }
LET           = _ "let" _ { return "let" }
LETMUT        = _ LET "mut" _ { return "let mut" }
ASSIGN        = _ '=' _   { return "=" }
IF            = _ "if" _  { return "if" }
THEN          = _ "then" _ { return "then" }
ELSE          = _ "else" _ { return "else" }
WHILE         = _ "while" _ { return "while" }
DO            = _ "do" _ { return "do" }
LOOP          = _ "loop" _ { return "loop" }
FOR           = _ "for" _  { return "for" }

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
