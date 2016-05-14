'use strict';
var express = require('express');
var router = express.Router();

// Model
var compiler = require('../model/compiler');

/* GET users listing. */
router.get('/', function(req, res, next) {
  try {
    let file = req.query.file;
    res.send({'result': compiler.compile(file)});
  } catch(e) {
    console.log(e);
  }
});

module.exports = router;
