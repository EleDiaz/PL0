/*jshint esversion: 6 */
/*jshint node:true */

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
        return true;
    }

    findSymbolInCurrentTable(a) {
        return false;
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
