"use strict";
const util = require('util');
const semantic = require('../lib/semantic');
var Tracer = require('pegjs-backtrace');
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
    var tracer = new Tracer(text);
    try {
        var r = PEG.parse(text, {tracer: tracer});
        semantic.semantic(r);
        return util.inspect(r, {depth: null});
    } catch (e) {
        console.log(tracer.getBacktraceString());

        console.log(`Error en línea ${e.location.start.line} columna ${e.location.start.column}`);
        console.log(e);
    }
};
