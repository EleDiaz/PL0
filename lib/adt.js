/*jshint esversion: 6 */
/*jshint node:true */
"use strict";
/**
 * TODO: En los nodos que contengan condicionales se podria crear una nueva tabla
 * de símbolos para el caso:
 * if let Just x = getUserInput() then print(x)
 * Se podria ver como azucar sintatica a una expresion case de haskell
 * quizas se deba implementar esta última primero
 * Y antes de esta se deberia plantear el diseño de los ADT
 */


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

    eachNode(func) {}
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

    eachNodePre(func) {
        for (let tree of this.sequence) {
            func(tree);
            tree.eachNodePre(func);
        }
    }

    eachNodePost(func) {
        for (let tree of this.sequence) {
            tree.eachNodePre(func);
            func(tree);
        }
    }
}

class FunctionDecl extends Generic {
    generateSymbolTable(symbolTable) {
        this.symbolTable = new SymbolTable();
        this.symbolTable.father = symbolTable;
        for (let tree of this.params) {
            this.symbolTable.addToSymbol(tree.name, tree.type, { realType: "unknown" });
        }

        console.log(this.symbolTable);
        this.block.generateSymbolTable(this.symbolTable);
    }

    eachNodePre(func) {
        for (let tree of this.params) {
            func(tree);
            tree.eachNodePre(func);
        }
        func(this.block);
        this.block.eachNodePre(func);
    }

    eachNodePost(func) {
        for (let tree of this.params) {
            tree.eachNodePre(func);
            func(tree);
        }
        this.block.eachNodePost(func);
        func(this.block);
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

    eachNodePre(func) {
        func(this.block);
        this.block.eachNodePre(func);
    }

    eachNodePost(func) {
        this.block.eachNodePost(func);
        func(this.block);
    }
}

class Variable extends Expresion {}

class Constant extends Expresion {}

class IfThen extends Expresion {
    generateSymbolTable(symboltable) {
        super.generateSymbolTable(symboltable);
        this.trueCase.generateSymbolTable(symboltable);
    }

    eachNodePre(func) {
        func(this.cond);
        this.cond.eachNodePre(func);

        func(this.trueCase);
        this.trueCase.eachNodePre(func);
    }

    eachNodePost(func) {
        this.cond.eachNodePost(func);
        func(this.cond);

        this.trueCase.eachNodePost(func);
        func(this.trueCase);
    }
}

class IfThenElse extends IfThen {
    generateSymbolTable(symboltable) {
        super.generateSymbolTable(symboltable);
        this.falseCase.generateSymbolTable(symboltable);
    }

    eachNodePre(func) {
        super.eachNodePre(func);
        func(this.falseCase);
        this.falseCase.eachNodePre(func);
    }

    eachNodePost(func) {
        super.eachNodePost(func);
        this.falseCase.eachNodePost(func);
        func(this.falseCase);
    }
}

class While extends Expresion {
    eachNodePre(func) {
        func(this.cond);
        this.cond.eachNodePre(func);
        super.eachNodePre(func);
    }

    eachNodePost(func) {
        this.cond.eachNodePost(func);
        func(this.cond);
        super.eachNodePost(func);
    }
}

class Loop extends Expresion {}

// TODO: Falta crear la tabla de simbolo? o añadir `element` en la anterior
class Map extends Expresion {
    eachNodePre(func) {
        func(this.iterator);
        this.iterator.eachNodePre(func);
        super.eachNodePre(func);
    }

    eachNodePost(func) {
        this.iterator.eachNodePost(func);
        func(this.iterator);
        super.eachNodePost(func);
    }
}

class Apply extends Expresion {
    eachNodePre(func) {
        for (let param of this.params) {
            func(this.param);
            param.eachNodePre(func);
        }
    }

    eachNodePost(func) {
        for (let param of this.params) {
            param.eachNodePre(func);
            func(this.param);
        }
    }
}

// TODO: Se debe checkear si existe en la tabla
class Identifier extends Expresion {}

class Operation extends Expresion {
    eachNodePre(func) {
        func(this.left);
        this.left.eachNodePre(func);
        func(this.right);
        this.right.eachNodePre(func);
    }

    eachNodePost(func) {
        this.left.eachNodePre(func);
        func(this.left);
        this.right.eachNodePre(func);
        func(this.right);
    }
}

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

