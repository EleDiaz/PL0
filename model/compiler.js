"use strict";
const util = require('util');
const semantic = require('../lib/semantic');
var PEG = require('../lib/pl0.js');
exports.compileToAST = (text) => {
    try {
        return PEG.parse(text);
    }
    catch (e) {
        return e.toString();
    }
};
exports.compile = (text) => {
    try {
        var r = PEG.parse(text);
        semantic.semantic(r);
        return util.inspect(r, { depth: null });
    }
    catch (e) {
        console.log(e);
        return e;
    }
};
