const mongoose = require("mongoose");
const schema = mongoose.Schema({
    username:String,
    password:String,
});
const adminModel = mongoose.model("Admin", schema);
module.exports = adminModel;