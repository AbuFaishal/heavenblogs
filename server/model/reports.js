const mongoose = require("mongoose");
const schema = mongoose.Schema({
    postId:String,
    report:String,
    reporting_person_id:String,
    reporting_person_name:String,
    dor:{
        type:Date,
        default:Date.now()
    }
});
const reportModel = mongoose.model("Report", schema);
module.exports = reportModel;