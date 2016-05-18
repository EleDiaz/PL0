/// <reference path="../typings/main.d.ts" />
// ! Run test with
// > mocha --harmony_destructuring
// or
// > npm test

import * as chai from 'chai'
import * as ADT from '../lib/adt'
import * as compiler from '../model/compiler'

let expect = chai.expect


describe('Grammar', () => {
  it('Should parse simple program', () => {
    let program = `{}`
    let adt = compiler.compileToAST(program)
    expect(adt).an.instanceof(ADT.Program)
    expect(adt.name).eq('$main')
    expect(adt.main).instanceof(ADT.Compound)
  })

  it('Parse a simple expresion', () => {
    let program =`5+5`
    let adt = compiler.compileToAST(program)
    expect(adt.main).an.instanceof(ADT.Operation);
  })
  // Test de asociatividad
  // Funciones
  // statmentos
  // returns
  //
})
