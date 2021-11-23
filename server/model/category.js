const mongoose = require("mongoose");
const schema = mongoose.Schema({
    category:String,
    disable:{
        type:Boolean,
        default:false
    }
});
const categoryModel = mongoose.model("Category", schema);
module.exports = categoryModel;