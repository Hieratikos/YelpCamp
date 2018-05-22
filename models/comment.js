var mongoose = require("mongoose");

//SCHEMA SETUP
var commentSchema = new mongoose.Schema({
    text: String,
    author: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        username:String
    }
});
//EXPORT THE SCHEMA OBJECT
module.exports = mongoose.model("comment", commentSchema);