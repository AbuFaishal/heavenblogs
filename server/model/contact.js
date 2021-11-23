const mongoose = require("mongoose");
const validator = require("validator");
const schema = mongoose.Schema({
    name: String,
    email: {
        type: String,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw Error("Invalid Email")
            }
        }
    },
    message: {
        type:String,
        trim:true,
    },
    date:{
        type:Date,
        default:Date.now()
    },
    read:{
        type:Boolean,
        default:false
    }
});

const contactModel = mongoose.model("Contactus", schema);
module.exports = contactModel;