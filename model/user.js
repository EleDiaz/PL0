var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new mongoose.Schema({
  username: String,
  password: String
});

User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', User);
