var mongoose                = require("mongoose");
var passportLocalMongoose   = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});
//adds methods to the User model
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("user", UserSchema);