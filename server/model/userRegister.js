const mongoose = require("mongoose");
const validator = require("validator");

const schema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim:true
    },
    password: {
        type: String,
        required: true,
        trim:true
    },
    gender: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw Error("Invalid Email")
            }
        }
    },
    profilepic: 
    {
        type:String,
        default:""
    },
    cloudinary_id:{
        type:String,
        default:""
    },
    token: String
});

const RegisterModule = mongoose.model("Registereduser", schema);
module.exports = RegisterModule;