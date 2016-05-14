/* jshint  esversion: 6 */
'use strict';

var mongoose = require('mongoose');

let Schema = mongoose.Schema;

let csvSchema = new Schema({
  name: String,
  csv: String,
});


class CsvModel {
    // esto peta :( si se llama dos veces un metodo el disconect pero es que no
    // hay un puto destructor en javascript
    constructor() {
        mongoose.connect('mongodb://localhost/csv');
        this.Csv = mongoose.model('Csv', csvSchema);
    }

    /*
     * Recieve user and name of file with its contents in csv
     */
    saveCsvInDb(filename, csv) {
        var input = new this.Csv({ name: filename, csv: csv});
        return input.save((err) => {
                if (err) {
                    console.log("Problem on save csv " + err);
                }
            }).then( (value) => {
                mongoose.connection.close();
            });
    }

    /*
     * Load a determinate csv file database if no found its return -1
     */
    loadCsv(filename) {
        return this.Csv.findOne( { name: filename }, (err, selected) => {
                if (err) {
                    console.log(`No found: --- ${filename} --- ${err}`);
                }
            }).then( (value) => {
                mongoose.connection.close();
                return value.csv
            });
    }
    
    /**
     * Se recogen todas las filas de la base de datos
     */
    getCsvList() {
        return this.Csv.find({}, (err, selected) => {
                if (err) {
                    console.log('ERROR get LIST CSV' + err);
                }
            }).then( (values) => {
                mongoose.connection.close();
                return values.map((obj) => { return obj.name; });
            });
    }
}

module.exports = CsvModel;


