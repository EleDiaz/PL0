/* jshint  esversion: 6 */
'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var codeSchema = new Schema({
  name: String,
  code: String
});

//const modelCode = mongoose.model("code", codeSchema);
const mongoDB = 'mongodb://localhost/';
const GUEST = "guest";

// Save code
const saveCode = (user, name, code) => {
  var conn = mongoose.createConnection (mongoDB + user.username);
  var model = conn.model ("code", codeSchema);
  var query = new model ({ name: name, code: code});
  return query.save ((err) => {
    if (err) {
      console.log (console.log("Error on save code " + err));
    }
  }).then( (value) => {
      conn.close();
  });
};

// Update code
const updateCode = (user, name, code) => {
  var conn = mongoose.createConnection (mongoDB + user.username);
  var model = conn.model ("code", codeSchema);
  model.findOne({ 'name': name }, (err, doc) => {
    if (err) { console.log("Error on update code " + err);}
    if (!doc) {
      let closeConnection = conn.close();
      Promise.all([closeConnection]).then((value) => {
        save = saveCode (user, name, code);
      });
    } else {
      doc.code = code;
      doc.save ();
    }
  }).then ((value) => {
    conn.close();
  });
};

// Get code by the name
const getCode = (user, name) => {
  if (user != "") {
    var conn = mongoose.createConnection (mongoDB + user.username);
  } else {
    // Conexión invitado
    var conn = mongoose.createConnection (mongoDB + GUEST);
  }

  var model = conn.model ("code", codeSchema);
  return model.findOne ({ name: name }, (err, result) => {
    if (err) { console.log ("Error on get code " + err);}
  }).then ((value) => {
    conn.close();
    return value;
  });
};

// Get all codes by the user
const getListOfCodes = (user) => {
  if (user != "") {
    var conn = mongoose.createConnection (mongoDB + user.username);
  } else {
    // Conexión invitado
    var conn = mongoose.createConnection (mongoDB + GUEST);
  }

  var model = conn.model ("code", codeSchema);
  return model.find ({}).sort('name').exec((err, result) => {
    if (err) { console.log ("Error on get code " + err);}
  }).then ((value) => {
    conn.close();
    return value.map((obj) => { return obj.name; });
  });
};

// Create db and insert HelloWorld
const createHelloWorld = (user) => {
  var conn = mongoose.createConnection (mongoDB + user.username);
  conn.close().then ((value) => {
    return updateCode (user, "helloWorld", "3+3");
  });
}

// Create examples and user guest
const initDb = () => {

  var examples = [
    ["example 1", "1+1"],
    ["example 2", "2+2"],
    ["example 3", "3+3"],
    ["example 4", "4+4"],
    ["example 5", "5+5"],
    ["example 6", "6+6"]
  ];

  examples.forEach ((example) => {
    var conn = mongoose.createConnection (mongoDB + GUEST);
    var model = conn.model ("code", codeSchema);

    model.findOne({ 'name': example[0] }, (err, doc) => {
      if (err) { console.log("Error on update code " + err);}
      if (!doc) {
        // Crear documento
        var query = new model ({ name: example[0], code: example[1]});
        query.save ((err) => {
          if (err) {
            console.log (console.log("Error on save code " + err));
          }
        }).then( (value) => {
            conn.close();
        });
      } else {
        // Actualizar documento
        doc.code = example[1];
        doc.save ();
      }
    }).then ((value) => {
      conn.close();
    });
  });

  return 1;
}


module.exports = {saveCode, updateCode, getCode, getListOfCodes, createHelloWorld, initDb, GUEST};
