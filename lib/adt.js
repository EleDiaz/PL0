/*jshint esversion: 6 */
/*jshint node:true */
"use strict";

var SymbolTable = require('./symboltable');

SymbolTable = SymbolTable.SymbolTable;

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

	generateSymbolTable(symbolTable) {}
}


class Program extends Generic {
	generateSymbolTable() {
		this.symbolTable = new SymbolTable();

		for (let tree of this.sequence) {
			this.symbolTable.addToSymbol(tree.name, tree.type, { realType: "unknown" });
		}

		// Una vez creada la tabla padre se procede a la hijo
		// si se hace a la vez todos las variables se deben
		// declarar por encima de su uso en el mismo nivel
		// De esta forma evitamos la restriccion de c
		for (let tree of this.sequence) {
			tree.generateSymbolTable(this.symbolTable);
		}
	}
}

// MALL constant y varible
class Declaration extends Generic {}

class FunctionDecl extends Declaration {
	generateSymbolTable(symbolTable) {
        this.symbolTable = new SymbolTable();
        this.symbolTable.father = symbolTable;
        for (let tree of this.params) {
			this.symbolTable.addToSymbol(tree.name, tree.type, { realType: "unknown" });
        }

        console.log(this.symbolTable);
        this.block.generateSymbolTable(this.symbolTable);
	}
}

class Expresion extends Generic {
    /**
     * Se da el caso de que las variables y constantes pueden
     * tener una expresion, en donde se declaren variables temporales
     */
    generateSymbolTable(symboltable) {
        if (this.cond !== undefined) {
            this.cond.generateSymbolTable(symboltable);
        }
        if (this.block !== undefined) {
            this.block.generateSymbolTable(symboltable);
        }
    }
}

class Variable extends Expresion {}

class Constant extends Expresion {}

class IfThen extends Expresion {
    generateSymbolTable(symboltable) {
        super.generateSymbolTable(symboltable);
        this.trueCase.generateSymbolTable(symboltable);
    }
}

class IfThenElse extends IfThen {
    generateSymbolTable(symboltable) {
        super.generateSymbolTable(symboltable);
        this.falseCase.generateSymbolTable(symboltable);
    }
}

class While extends Expresion {}

class Loop extends Expresion {}

class Map extends Expresion {}

class Apply extends Expresion {}

// TODO: Se debe checkear si existe en la tabla
class Identifier extends Expresion {}

class Operation extends Expresion {}

class Assign extends Expresion {}

/**
 * En este caso se debe comprobar que las varibles usadas estan en la tabla de símbolos
 * si no se puede asegurar que la declaracion esta antes de su uso
 */
class Compound extends Generic {
    /**
     * Se realiza una comprobación de variables en esta fase
     * debido a que el árbol aquí representa una ejecución lineal
     * Es decir la declaracion de una variable debe estar antes
     * de su uso en este caso
     */
    generateSymbolTable(symboltable) {
        this.symbolTable = new SymbolTable(symboltable);

        for (let expr of this.sequence) {
            if (expr.name && expr.type && expr.type !== "Assign") {
                this.symbolTable.addToSymbol(expr.name, expr.type, { realType: "unknown" });
            }
            expr.generateSymbolTable(this.symbolTable);
        }
    }
}

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
exports.Assign = Assign;
exports.Compound = Compound;
exports.Literal = Literal;

