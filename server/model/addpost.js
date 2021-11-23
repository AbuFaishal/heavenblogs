const mongoose = require("mongoose");
const schema = mongoose.Schema({
    userId: String,
    username: String,
    category: String,
    title: String,
    blogimage: {
        type: String,
        default: ""
    },
    cloudinary_id:{
        type:String,
        default:""
    },
    vlink: {
        type: String,
        default: ""
    },
    description: {
        type: String,
        trim: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    disable:{
        type:Boolean,
        default:false
    },
    message:{
        type:String,
        default:""
    }
});
const postModel = mongoose.model("Post", schema);
module.exports = postModel;