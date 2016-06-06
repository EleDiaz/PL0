# A project, A language

## Gramática del lenguaje
Un programa consta de lista de declaraciones.

```haskell
program
    = declaration+
```

Donde una declaraciones, puede se una variable, constante o función
```haskell
declaration "declaration of var, const or function"
    = variable
    / constant
    / function
```

Las funciones tienen una sintaxis parecida a Scala
```haskell
function "function"
    = FUNCTION NAMEID LEFTPAR paramType* RIGHTPAR (RARROW TYPE)?
               inlineComment?
               compoundExpr
```

Un ejemplo real de una función es el siguiente
```
fun fooBar()
	"Esta función hace poco"
{

}

fun barFoo() -> Void {}
```
De forma opcional se le puede añadir un comentario "inline" en la función para documentarla, o especificar los tipos de entrada y salida
aún no se ha implementado un "typechecker" con lo que los tipos se pueden usar como anotaciones.

```
fun add(a:Int b:Int) -> Int {
	a + b
}
```

Es posible daclarar variables en el lenguaje, se le puede asignar una expresión y opcionalmente una anotación de tipo.
```haskell
variable "variable"
    = LETMUT paramType ASSIGN expr
```

Un ejemplo ilustrativo:

```
let hola : Anotacion = if true then {0} else {1}
```

La sintaxis para declarar una constante es la misma que la de la variable cambiando `let mut`  por `let` solo
```haskell
constant "constant"
    = LET paramType ASSIGN expr
```

Las anotaciones de parámetros se indican con el nombre identificado seguido de su tipo, el cual es opcional.
```haskell
paramType = _ NAMEID (DOTS TYPE)? _

type = TYPE MINOR type GREATER
     / TYPE
```

Existen una variedad de expresiones que admite el lenguaje
```haskell
expr "Expresion"
    = // Operator to factors
      level0
      // Variable
    / variable
      // Constant
    / constant
      // If Then Else
    / IF expr THEN compoundExpr ELSE compoundExpr
      // If Then
    / IF expr THEN compoundExpr
      // While loop use a expr to get condition
    / WHILE expr compoundExpr
      // Infinite loop
    / LOOP compoundExpr
      // Map loop over a data structure iterable
    / FOR NAMEID LARROW expr compoundExpr
      // Assign expresion to a variable previously declared
    / !RESERVED NAMEID ASSIGN expr
      // Addiction of lambda expresion
    / LAMBDA paramType+ RARROW expr
```

Algunas expresiones pueden contener, una secuencia de expresiones, las cuales se encierran con {}
```haskell
compoundExpr "Compound several expresion in one"
    = // Clasical brackets to envolve a expresion
    LBRACKET expr* RBRACKET
```

El lenguaje tiene definido varios niveles de precedencia 
```javascript
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
```

```haskell
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
```

Existen diversos tipos primitivos que se pueden escribir en el lenguaje.
- Números enteros
- Character
- Arrays de expresiones
- Booleanos
- Strings
```haskell
factor "factor(number, identifier, parens)"
    = NUMBER
    / _ (FALSE / TRUE) _
    / CHAR
    / _ '"' $literalString* '"' _
    / LSQUARE !COMMA expr? (COMMA expr)* RSQUARE
      // Apply of function
    / !RESERVED NAMEID
            LEFTPAR !COMMA
                expr? (COMMA expr)*
            RIGHTPAR
      // Identifier
    / !RESERVED NAMEID
      // Parens
    / LEFTPAR expr RIGHTPAR
	/ BREACK
```

```haskell
literalString
    = !('"' / '\\') .
    / '\\' .
```

```haskell
inlineComment = _ '"' $literalString* '"' _
```

Se definen los comentario igual que en lenguajes c-like
```
_ "whitespace"
    = [ \t\n\r]* "//" (!"\n" .)* "\n"? _
    / [ \t\n\r]* "/*" (!"\*/" .)* "*/" _
    / $[ \t\n\r]*

__ "Horizontal Space" = $[ \t]

EOL = $[\n\r]
```

```haskell
// Tokens
NUMBER        = _ digits:$[0-9]+ _ { return parseInt(digits, 10); }
NAMEID        = _ id:$([a-z_][a-zA-Z_0-9']*) _ { return id }
TYPE          = _ id:$([A-Z_][a-zA-Z_0-9']*) _ { return id }
CHAR          = _ "'" c:. "'" _                { return c }
OP            = _ !("//" / "/*" / "*/" / ASSIGN)op:$[-+=*/&%$!@?^:_<>]+    _ { return op }
// Reserved words
RESERVED = (FUNCTION / LET / LETMUT / IF / ELSE / THEN / WHILE / DO / LOOP / FOR / FALSE / TRUE / BREACK)

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
```



## Tools used

There are used several languages
- Javascript (ecma 6)
  - All project
- Sass
  - It is compiled with a middleware by server see **app.js**
- pegjs-strip
- pegjs-backtrace


## Types and ADT

### Como implementar un arbol de datos abstracto?
- TODO: Hacer la equivalencia de tipos estructural en los ADT para evitar el
        problema de haskell(seguramente saldran problemas de indeterminacion de
        tipos al intentar inferirlos)
- Consideremos la siguiente sintaxis
data NombreTipo = ValueA | ValueB | ValueC .....

En este caso solo necesitamos la union
Result: Union (NameData ValueA) (Union (NameData ValueB) (NameData ValueC))
:
data NombreTipo = Value Int Char Char

En este caso usamos el producto de tipos(una struct típica de c-like)
Result: NameData Value (Product Int (Product Char Char))

data NombreTipo a = Value a

En este caso tenemos valor sin predefinir que puede ser cualquier cosa 'a'
Result: NameData Value All

Con mas detalle:

DataTree NombreTipo (All a)
	NameData Value (All a)

data NombreTipo (forall a) = Value a

```haskell
type Name = String

data DefData = DefData Name ADT

data ADT = Union ADT ADT    -- Identifica la union de tipos
		 | Product ADT ADT  -- Identifica los productos de tipos
		 | IDData Name      -- Identifica los datos (ej: True, False, Uno, Dos...)
		 | All Name         -- Identifica los cuantificadores universales

```

### Tipos inferencia

http://akgupta.ca/blog/2013/05/14/so-you-still-dont-understand-hindley-milner/
