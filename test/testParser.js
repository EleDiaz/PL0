/*jshint esversion: 6 */
/*jshint node:true */

"use strict";
const fs = require('fs');
const chai = require('chai');
const ADT = require('../lib/adt');
const compiler = require('../model/compiler');
let expect = chai.expect;

const CURRENT_DIR = "./test/testFiles/";

const loadTest = () => {
    let files = fs.readdirSync(CURRENT_DIR, 'utf8');

    for (let file of files) {
        let program = fs.readFileSync(CURRENT_DIR + file, 'utf8');
        it('Testing `' + file + '`', () => {
            expect(compiler.compileToAST(program)).instanceof(ADT.Program);
        });
    }
};


describe('Grammar', () => {
    loadTest();
});
