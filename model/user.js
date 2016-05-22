var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new Schema({
  username: String,
  password: String
});

//User.plugin(passportLocalMongoose);
userSchema.plugin(passportLocalMongoose);
var db = mongoose.createConnection('mongodb://localhost/passport_local_mongoose_express4');
var User = db.model ('User', userSchema);

//module.exports = mongoose.model('User', User);
module.exports = User;
