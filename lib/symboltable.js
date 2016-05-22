/*jshint esversion: 6 */
/*jshint node:true */
"use strict";

/**
 * A symbol table its storage information of differents scopes into tree.
 * This structure should into a tree
 */
class SymbolTable {
    constructor() {
        this.symbolTable = {};
        this.father = null;
    }

    findSymbol(symbol) {
        let table = this;
        while (table.findSymbolInCurrentTable(symbol)) {
            table = table.father;
        }
    }

    findSymbolInCurrentTable(symbol) {
        return this.symbolTable[symbol];
    }

    /**
     * Add a new symbol into symbol table and checks, overriding
     */
    addToSymbol(identifier, type, properties) {
        if (this.findSymbolInCurrentTable(identifier)) {
            throw new Error("Redifinition of symbol: " + identifier);
        }
        if (this.findSymbol(identifier)) {
            console.log("Warning: Shawdow a variable previously declared: " + identifier);
        }

        this.symbolTable[identifier] = { type: type, properties: properties };
    }
}

exports.SymbolTable = SymbolTable;
