/// <reference path="../typings/main.d.ts" />

import * as util from 'util';
import * as semantic from '../lib/semantic'
import * as ADT from '../lib/adt'
var PEG = require('../lib/pl0.js')

export let compile = (text : String) : string => {
  try {
    var r = PEG.parse(text);
    semantic.semantic(r);
    return util.inspect(r, {depth: null})
  } catch(e) {
    console.log(e)
    return e
  }
}
