const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
//user api import
const { register, getuser, getallusers, checkRegistered, login, islogin, logout, addpost,
    getposts, getpostbyid, deletepost, updatepost, getpostbycateory, getpostbyauthor,
    addcomment, getcomments, deletecomment, updateuser, updateprofileimage,
    userpostscount, updateblogimage, contact, report, getreportbyid } = require("./middleware/middlewares");
//admin api import
const { adminlogin, isadminlogin, adminlogout, addcategory, getcategories,
    deletecategory, disableenabletoggle, blockpost, deleteuser, getallreports,
    getmessages, deletemessage, setread } = require("./middleware/middlewares");

// storing image using multer
const upload1 = multer({ storage: multer.diskStorage({}) });
const upload2 = multer({ storage: multer.diskStorage({}) });//it will give image path
//routing
router.get("/checkRegistered", checkRegistered);
router.get("/getallusers", getallusers);
router.get("/getuser/:id", getuser);
router.get("/islogin", islogin);
router.get("/logout", logout);
router.get("/getposts", getposts);
router.get("/getpostbyid/:id", getpostbyid);
router.get("/getpostbycateory/:category", getpostbycateory);
router.get("/getpostbyauthor/:authorId", getpostbyauthor); userpostscount
router.get("/userpostscount/:id", userpostscount);
router.get("/getcomments", getcomments);
router.post("/register", register);
router.post("/updateuser/:id", updateuser);
router.post("/login", login);
router.post("/addpost", upload2.single('blogimage'), addpost);
router.post("/addcomment", addcomment);
router.delete("/deletepost/:id", deletepost);
router.delete("/deletecomment/:id", deletecomment);
router.patch("/updatepost/:id", updatepost);
router.patch("/updateprofileimage/:id", upload1.single('photo'), updateprofileimage);
router.patch("/updateblogimage/:id", upload2.single('blogimage'), updateblogimage);
router.post("/contact", contact);
router.post("/report", report);
router.get("/getreportbyid/:postid/:userid", getreportbyid);
// Admin api 
router.get("/isadminlogin", isadminlogin);
router.get("/adminlogout", adminlogout);
router.get("/getcategories", getcategories);
router.get("/disableenabletoggle/:id", disableenabletoggle);
router.get("/blockpost/:id", blockpost);
router.get("/getallreports", getallreports);
router.get("/getmessages", getmessages);
router.post("/adminlogin", adminlogin);
router.post("/addcategory", addcategory);
router.delete("/deletecategory/:id", deletecategory);
router.delete("/deleteuser/:id", deleteuser);
router.delete("/deletemessage/:id", deletemessage);
router.patch("/setread/:id", setread);

module.exports = router;