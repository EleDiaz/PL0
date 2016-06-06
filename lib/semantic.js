/*jshint esversion: 6 */
/*jshint node:true */
"use strict";

const ADT = require('./ast');

exports.semantic = (tree) => {
    tree.generateSymbolTable();
};


// Checks variable creaction
// take a tree and with las symboltable checks if is in table
let checkScope = (node) => {
        // code
};

// reduce symbolTable if empty symbolTable remove and make link to parent to next
let reduceSymbolTables = () => {
    let lastSymb = null;
    return (node) => {
        // code
    };
};

