/*
 * PEGjs for a "Pl-0" like language
 * Used in ULL PL Grado de Informática classes
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

program "program"
    = b:block { return new ADT.Program(location(), b); }

block "block"
    = cD:constantDeclaration? vD:varDeclaration? fD:functionDeclaration* st:st
      {
        let constants = cD? cD : [];
        let variables = vD? vD : [];
        return new ADT.Block(location(), variables, constants, fD, st)
      }

constantDeclaration "constants"
    = CONST id:ID ASSIGN n:NUMBER rest:(COMMA ID ASSIGN NUMBER)* SC
      {
        let r = rest.map( ([_, id, __, nu]) => new ADT.Const(location(), id.value, nu.value, 'Any'));
        return [new ADT.Const(location(), id.value, n.value, 'Any')].concat(r);
      }

varDeclaration "var"
    = VAR id:ID rest:(COMMA ID)* SC
      {
        let r = rest.map( ([_, id]) => new ADT.Var(location(), id.value, 'Any'));
        return [new ADT.Var(location(), id.value, 'Any')].concat(r);
      }

functionDeclaration "function"
    = FUNCTION id:ID LEFTPAR !COMMA p1:ID? r:(COMMA ID)* RIGHTPAR b:block
      {
        let params = p1? [p1] : [];
        params = params.concat(r.map(([_, p]) => p));
        return new ADT.FunctionBlock(location(), id, params, b);
      }


st "statements(st, if, while, return)"
    = CL s1:st? r:(SC st)* SC* CR
      {
        let t = [];
        if (s1) t.push(s1);
        return new ADT.Compound(location(), t.concat(r.map( ([_, st]) => st )))
      }
    / IF e:assign THEN st:st ELSE sf:st
      {
        return new ADT.IfThenElse(location(), e, st, sf);
      }
    / IF e:assign THEN st:st
      {
        return new ADT.IfThenElse(location(), e, st);
      }
    / WHILE a:assign DO st:st
      {
        return new ADT.While(location(), a, st);
      }
    / RETURN a:assign?
      {
        return new ADT.Return(location(), a);
      }
    / assign

assign "assign or condition"
    = i:ID ASSIGN e:cond
      {
        return new ADT.Assign(location(), i, e);
      }
    / cond

cond "conditional"
    = l:exp op:COMP r:exp
      {
        return new ADT.Operation(location(), op, [l, r]);
      }
     / exp

exp    = t:term   r:(ADD term)*   { return tree(t,r); }
term   = f:factor r:(MUL factor)* { return tree(f,r); }

factor "factor(number, identifier, parens)"
    = n:NUMBER
      {
        return new ADT.Literal(location(), n, "Int");
      }
    / f:ID LEFTPAR a:assign? r:(COMMA assign)* RIGHTPAR
      {
        let t = a ? [a] : [];
        return new ADT.Apply(location(), f, t.concat(r.map(([_, exp]) => exp)));
      }
    / ID
    / LEFTPAR t:assign RIGHTPAR
      {
        return t;
      }

_ "whitespace" = $[ \t\n\r]*


// Tokens
ASSIGN   = _ op:'=' _  { return op; }
ADD      = _ op:[+-] _ { return op; }
MUL      = _ op:[*/] _ { return op; }
LEFTPAR  = _"("_
RIGHTPAR = _")"_
CL       = _"{"_
CR       = _"}"_
SC       = _";"+_
COMMA    = _","_
COMP     = _ op:("=="/"!="/"<="/">="/"<"/">") _ {
               return op;
            }
IF       = _ "if" _
THEN     = _ "then" _
ELSE     = _ "else" _
WHILE    = _ "while" _
DO       = _ "do" _
RETURN   = _ "return" _
VAR      = _ "var" _
CONST    = _ "const" _
FUNCTION = _ "function" _
ID       = _ id:$([a-zA-Z_][a-zA-Z_0-9]*) _
            {
              return id;
            }
NUMBER   = _ digits:$[0-9]+ _
            {
              return parseInt(digits, 10);
            }
