/* jshint  esversion: 6 */
'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var codeSchema = new Schema({
  name: String,
  code: String
});

const modelCode = mongoose.model("code", codeSchema);
const mongoDB = 'mongodb://localhost/';

// Save code
const saveCode = (user, name, code) => {
  mongoose.connect (mongoDB + user.username);
  var query = new modelCode ({ name: name, code: code});
  return query.save ((err) => {
    if (err) {
      console.log (console.log("Error on save code " + err));
    }
  }).then( (value) => {
      mongoose.connection.close();
  });
};

// Update code
const updateCode = (user, name, code) => {
  mongoose.connect (mongoDB + user.username);
  modelCode.findOne({ 'name': name }, (err, doc) => {
    if (err) { console.log (console.log("Error on update code " + err));}
    if (!doc) {
      let closeConnection = mongoose.connection.close();
      Promise.all([closeConnection]).then((value) => {
        saveCode (user, name, code);
      });
    } else {
      doc.code = code;
      doc.save ();
    }
  }).then ((value) => {
    mongoose.connection.close();
  });
};

// Get code by the name
const getCode = (user, name) => {
  mongoose.connect (mongoDB + user.username);
  return modelCode.findOne ({ name: name }, (err, result) => {
    if (err) { console.log (console.log("Error on get code " + err));}
  }).then ((value) => {
    mongoose.connection.close();
    return value;
  });
};

// Get all codes by the user
const getListOfCodes = (user) => {
  mongoose.connect (mongoDB + user.username);
  return modelCode.find ({}, (err, result) => {
    if (err) { console.log (console.log("Error on get code " + err));}
  }).then ((value) => {
    mongoose.connection.close();
  });
}

// Get all codes by the user
const genHelloWorld = (user) => {
  return updateCode (user, "helloWorld", "3+3");
}

module.exports = {saveCode, updateCode, getCode, getListOfCodes};
