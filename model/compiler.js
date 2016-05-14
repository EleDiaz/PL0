"use strict";
var util = require('util');
var semantic = require('../lib/semantic');
var PEG = require('../lib/pl0.js');
exports.compile = function (text) {
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
