/*jshint esversion: 6 */
/*jshint node:true */
"use strict";

/**
 * A base class for all ADT
 */
class Generic {
    constructor(location, obj) {
        this.location = location;

        // Get all properties from a given object and make own of class
        for (let property of Object.getOwnPropertyNames(obj)) {
            this[property] = obj[property];
        }
    }
    // Generate code from AST
    generateCode() {
        console.log("undefined? generation of code");
        return "";
    }

    getADTStructure() {
    }
}


class Program extends Generic {}

// MALL constant y varible
class Declaration extends Generic {}

class FunctionDecl extends Declaration {}

class Expresion extends Generic {}

class Variable extends Expresion {}

class Constant extends Expresion {}

class IfThen extends Expresion {}

class IfThenElse extends Expresion {}

class While extends Expresion {}

class Loop extends Expresion {}

class Map extends Expresion {}

class Apply extends Expresion {}

class Identifier extends Expresion {}

class Operation extends Expresion {}

/**
 * En este caso se debe comprobar que las varibles usadas estan en la tabla de symbolos
 * si no se puede asegurar que la declaracion esta antes de su uso
 */
class Compound extends Generic {}

class Literal extends Generic {}

exports.Generic = Generic;
exports.Program = Program;
exports.Declaration = Declaration;
exports.FunctionDecl = FunctionDecl;
exports.Expresion = Expresion;
exports.Variable = Variable;
exports.Constant = Constant;
exports.IfThen = IfThen;
exports.IfThenElse = IfThenElse;
exports.While = While;
exports.Loop = Loop;
exports.Map = Map;
exports.Apply = Apply;
exports.Identifier = Identifier;
exports.Operation = Operation;
exports.Compound = Compound;
exports.Literal = Literal;

