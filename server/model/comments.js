const mongoose = require("mongoose");
const schema = mongoose.Schema({
    userId: String,
    username: String,
    postId:String,
    comment:String,
    date:{
        type:Date,
        default:Date.now()
    }
});
const commentModel = mongoose.model("Comment", schema);
module.exports = commentModel;