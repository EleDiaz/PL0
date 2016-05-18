"use strict";
const chai = require('chai');
const ADT = require('../lib/adt');
const compiler = require('../model/compiler');
let expect = chai.expect;
describe('Grammar', () => {
    it('Should parse simple program', () => {
        let program = `{}`;
        let adt = compiler.compileToAST(program);
        expect(adt).an.instanceof(ADT.Program);
        expect(adt.name).eq('$main');
        expect(adt.main).instanceof(ADT.Compound);
    });
    it('Parse a simple expresion', () => {
        let program = `5+5`;
        let adt = compiler.compileToAST(program);
        expect(adt.main).an.instanceof(ADT.Operation);
    });
});
