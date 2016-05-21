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
  var ADT = require('./adt')

  var tree = function(f, r) {
    if (r.length > 0) {
      var last = r.pop();
      var result = new ADT.Operation(location(), last[0], [tree(f, r), last[1]])
    }
    else {
      var result = f;
    }
    return result;
  }
}

program
	= declaration+


declaration "declaration of var, const or function"
	= // Variable Declaration
	  variable
	/ // Constant Declaration
	  constant
	/ // Function Declaration with brackets syntax
	  FUNCTION name:NAMEID DOTS ps:(PARAMTYPE)+ RARROW end:TYPE
			   c:inlineComment?
			   e:compoundExpr {
		return { function: name
			   , params: ps
			   , end: end
			   , comment: c
			   , expresion: e}
			   }


variable "variable"
	= LETMUT param:PARAMTYPE ASSIGN e:expr c:inlineComment? {
		return { variable: param,  expresion: e, comment: c } }


constant "constant"
	= LET param:PARAMTYPE ASSIGN e:expr c:inlineComment? {
		return { variable: param,  expresion: e, comment: c } }


expr "Expresion??"
	= // Factor with basic operations
	  cond
	/ // Variable
	  variable
	/ // Constant
	  constant
    / // If Then Else
	IF c:expr THEN t:compoundExpr ELSE e:compoundExpr {
		return { type: "IFTHENELSE"
		       , cond: c
			   , then: t
			   , other: e}
	}
    / // If Then
	IF c:expr THEN t:compoundExpr {
		return { type: "IFTHEN"
			   , cond: c
			   , then: t}
	}
    / // While loop use a expr to get condition
	  WHILE expr compoundExpr
	/ // Infinite loop
	  LOOP compoundExpr
	/ // Map loop over a data structure iterable
	  MAP expr RARROW NAMEID compoundExpr
	/ // Apply of function
	  !RESERVED id:NAMEID
	  		LEFTPAR !COMMA
				e:compoundExpr? (COMMA compoundExpr)
			RIGHTPAR {
		return { identifier: id
		       , expresion: e}
	}
     //   let t = a ? [a] : [];
     //   return new ADT.Apply(location(), f, t.concat(r.map(([_, exp]) => exp)));
	/ // Identifier
	  !RESERVED id:NAMEID {
		return { identifier: id }
	}
    / // Parens
	  LEFTPAR expr RIGHTPAR


compoundExpr "Compound several expresion in one"
	= // Function Declaration with "haskell" syntax (experimental)
	  DO (expr __* EOL)+ "end" // Tener en cuenta la indentacion!!! una pila de indentacion?
	/ // Clasical brackets to envolve a expresion
	  LBRACKET  (expr _)* RBRACKET
	/ expr


cond "conditional"
    = l:exp op:COMP r:exp
      {
        return new ADT.Operation(location(), op, [l, r]);
      }
     / exp


exp
	= t:term   r:(ADD term)*   { return tree(t,r); }


term
	= f:factor r:(MUL factor)* { return tree(f,r); }


factor "factor(number, identifier, parens)"
    = n:NUMBER
      {
        return new ADT.Literal(location(), n, "Int");
      }
	/ CHAR
	/ _ '"' $literalString* '"' _
	/ RSQUARE !COMMA expr (COMMA expr)* LSQUARE

literalString
	= !('"' / '\\') .
	/ '\\' v:. { return v; }

inlineComment = _ '"' v:literalString '"' _ { return v }

_ "whitespace" = $[ \t\n\r]*

__ "Horizontal Space" = $[ \t]

EOL = $[\n\r]


// Tokens
NAMEID        = _ id:$([a-z_][a-zA-Z_0-9']*) _ { return id }
TYPE          = _ id:$([A-Z_][a-zA-Z_0-9']*) _ { return id }
PARAMTYPE     = _ NAMEID DOTS TYPE _
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
