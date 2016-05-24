# A project, A language

## TODO List:
- [ ] Favicon, seria el primero
- [ ] Parser (PEG), generate ADT
- [ ] desarrollar todo usando TDD de verdad, la cosa se pone chunga
	  si meto lambdas, ADT y tipado

## Gramatica del lenguaje
A nivel básico un existen las declaraciones que son:
- variables (let mut)
- Constantes (let)
- Funciones (fun)  -- TODO: la sintaxis quizas deba mejorar

Dentro de cada una de las declaraciones se puede escribir cualquier expresión
- 


## Tools used

There are used several languages
- Typescript
  - In /model and /lib
  - npm -g i typings   // manage types of different packages used  
- Javascript (ecma 6)
  - All project
- Sass
  - It is compiled with a middleware by server see **app.js**


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

Los llamo all y no any por no confundir con los cuantificadores existenciales, y mas
bien representa un cuantificador universal.

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
