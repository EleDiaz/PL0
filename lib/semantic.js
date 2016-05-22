/*jshint esversion: 6 */
/*jshint node:true */
"use strict";

const ADT = require('./adt');

exports.semantic = (tree) => {
    tree.generateSymbolTable();
};

