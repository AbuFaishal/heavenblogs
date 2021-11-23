
//importing models
const cloudinary=require("../cloudnary");
const RegisterModule = require("../../model/userRegister");
const postModel = require("../../model/addpost");
const commentModel = require("../../model/comments");
const contactModel = require("../../model/contact");
const adminModel = require("../../model/admin");
const categoryModel = require("../../model/category");
const reportModel = require("../../model/reports");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");


exports.checkRegistered = async (req, res) => {
    try {
        const namecheck = await RegisterModule.find({ username: req.query.name });
        const emailcheck = await RegisterModule.find({ email: req.query.email });
        if (namecheck.length > 0) {
            res.json("Username already found!");
        } else {
            if (emailcheck.length > 0) {
                res.json("Email already Registered!");
            } else {
                res.json(0);
            }
        }
    } catch (error) {
        console.log(error);
        res.json(error);
    }
}

exports.register = async (req, res) => {
    try {
        const result = await RegisterModule({
            username: req.body.username,
            gender: req.body.gender,
            email: req.body.email,
        });
        // if (req.body.photo !== "") {
        //     result.profilepic = req.file.filename;
        // }
        result.password = await bycrypt.hash(req.body.password, 10);
        result.token = jwt.sign({ id: result._id }, process.env.SECRET_KEY);
        await result.save();
        res.status(200).json("Registered");
    } catch (err) {
        res.json(err);
        console.log(err);
    }
}

exports.login = async (req, res) => {
    try {
        const userdata = await RegisterModule.find({ username: req.body.username });
        if (userdata.length === 1) {
            const verify = await bycrypt.compare(req.body.password, userdata[0].password);
            if (verify) {
                if (req.body.remember) {
                    res.cookie("bloglogin", userdata[0].token, {
                        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
                        httpOnly: true
                    })
                } else {
                    // console.log(userdata[0].token);
                    res.cookie("bloglogin", userdata[0].token, {
                        httpOnly: true
                    })
                }
                res.json("verified");
            } else {
                res.json("password is incorrect");
            }
        } else {
            res.json("Username Not found!");
        }
    } catch (error) {
        res.json(error);
        console.log(error);

    }
}

exports.islogin = async (req, res) => {
    try {
        // console.log(req.cookies.bloglogin);
        if (req.cookies.bloglogin) {
            const user = await RegisterModule.findOne({ token: req.cookies.bloglogin });
            res.json({
                username: user.username,
                id: user._id
            });
            // console.log(user);
        } else { res.json("no") }
    } catch (error) {
        console.log(error);
        res.json(error);
    }
}

exports.logout = async (req, res) => {
    try {
        res.clearCookie("bloglogin");
        res.json("deleted");
    } catch (error) {
        console.log(error);
        res.json(error);
    }
}

exports.addpost = async (req, res) => {
    try {
        const cloudinary_res=await cloudinary.uploader.upload(req.file.path,{folder:'heavenblogs/blogimages'});
        // console.log(result);
        const result = await postModel({
            userId: req.body.userid,
            username: req.body.username,
            blogimage:cloudinary_res.secure_url,
            cloudinary_id:cloudinary_res.public_id,
            category: req.body.category,
            title: req.body.title,
            vlink: req.body.vlink,
            description: req.body.description,
        });
        await result.save();
        res.status(200).json("added");
    } catch (error) {
        res.json(error);
        console.log(error);
    }
}

exports.updatepost = async (req, res) => {
    try {
        const data = await postModel.findByIdAndUpdate({ _id: req.params.id }, {
            category: req.body.category,
            title: req.body.title,
            vlink: req.body.vlink,
            description: req.body.description
        }, { new: true });
        // }

        res.status(200).json(data);
    } catch (error) {
        res.json(error);
        console.log(error);
    }
}

exports.getposts = async (req, res) => {
    try {
        const result = await postModel.find().sort({ date: -1 });
        res.json(result);
    } catch (error) {
        res.json(error);
        console.log(error);
    }
}

exports.deletepost = async (req, res) => {
    try {
        const data = await postModel.findById(req.params.id);
        if (data.blogimage!=="") {
            await cloudinary.uploader.destroy(data.cloudinary_id);
        }
        await postModel.findByIdAndDelete(req.params.id);
        res.json("deleted");
    } catch (error) {
        console.log(error);
        res.json(error);
    }
}

exports.getpostbyid = async (req, res) => {
    try {
        const result = await postModel.findById(req.params.id);
        res.json(result);
    } catch (error) {
        res.json(error);
        console.log(error);
    }
}

exports.getpostbycateory = async (req, res) => {
    try {
        if (req.params.category === "normal" || req.params.category === "all") {
            const result = await postModel.find().sort({ date: -1 });
            if (result.length === 0) {
                res.json("no");
            } else {
                res.json(result);
            }
        }
        else {
            const result = await postModel.find({ category: req.params.category }).sort({ date: -1 });
            if (result.length === 0) {
                res.json("no");
            } else {
                res.json(result);
            }
        }
    } catch (error) {
        console.log(error);
        res.json(error);
    }
}
exports.getpostbyauthor = async (req, res) => {
    try {
        const result = await postModel.find({ userId: req.params.authorId });
        if (result.length === 0) {
            res.json("no");
        } else {
            res.json(result);
        }
    } catch (error) {
        console.log(error);
        res.json(error);
    }
}

exports.addcomment = async (req, res) => {
    try {
        const result = await commentModel({
            userId: req.body.userId,
            username: req.body.username,
            postId: req.body.postId,
            comment: req.body.comment
        });
        await result.save();
        res.json("commented");
    } catch (error) {
        console.log(error);
        res.json(error);
    }
}

exports.getcomments = async (req, res) => {
    try {
        const result = await commentModel.aggregate([{
            $lookup: {
                from: "registeredusers",
                localField: "username",
                foreignField: "username",
                as: "user_detail"
            }
        }])
        // console.log(result);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.json(error);
    }
}

exports.deletecomment = async (req, res) => {
    try {
        await commentModel.findByIdAndDelete(req.params.id);
        res.json("deleted");
    } catch (error) {
        console.log(error);
        res.json(error);
    }
}

exports.getuser = async (req, res) => {
    try {
        const result = await RegisterModule.findById(req.params.id);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.json(error);
    }
}

exports.getallusers = async (req, res) => {
    try {
        const result = await RegisterModule.find();
        res.json(result);
    } catch (error) {
        console.log(error);
        res.json(error);
    }
}

exports.updateuser = async (req, res) => {
    try {
        await RegisterModule.findByIdAndUpdate(req.params.id, {
            username: req.body.username,
            gender: req.body.gender,
            email: req.body.email
        });
        await postModel.updateMany({ userId: req.params.id }, { username: req.body.username });
        await commentModel.updateMany({ userId: req.params.id }, { username: req.body.username });
        res.json("updated");
    } catch (error) {
        console.log(error);
        res.json(error);
    }
}
exports.updateprofileimage = async (req, res) => {
    try {
        const userdetail = await RegisterModule.findById(req.params.id);
        console.log(userdetail);
        if (userdetail.profilepic!=="") {
            await cloudinary.uploader.destroy(postdetail.cloudinary_id);
        }
        const cloudinary_res=await cloudinary.uploader.upload(req.file.path,{folder:'heavenblogs/userprofile'});
        await RegisterModule.findByIdAndUpdate({ _id: req.params.id }, { profilepic: cloudinary_res.secure_url,cloudinary_id:cloudinary_res.public_id });
        res.json("updated");
    } catch (error) {
        console.log(error);
        res.json(error);
    }
}

exports.userpostscount = async (req, res) => {
    try {
        const result = await postModel.find({ userId: req.params.id }).count();
        res.json(result);
    } catch (error) {
        console.log(error);
        res.json(error);
    }
}

exports.updateblogimage = async (req, res) => {
    try {
        const postdetail = await postModel.findById(req.params.id);
        if (postdetail.blogimage!=="") {
            await cloudinary.uploader.destroy(postdetail.cloudinary_id);
        }
        const cloudinary_res=await cloudinary.uploader.upload(req.file.path,{folder:'heavenblogs/blogimages'});
        await postModel.findByIdAndUpdate({ _id: req.params.id }, { blogimage: cloudinary_res.secure_url,cloudinary_id:cloudinary_res.public_id });
        res.json("updated");
    } catch (error) {
        console.log(error);
        res.json(error);
    }
}

exports.contact = async (req, res) => {
    try {
        const result = await contactModel({
            name: req.body.name,
            email: req.body.email,
            message: req.body.message
        });
        await result.save();
        res.json("message sent");
    } catch (error) {
        console.log(error);
        res.json(error);
    }
}

exports.report = async (req, res) => {
    try {
        const result = await reportModel({
            postId: req.body.postId,
            report: req.body.report,
            reporting_person_id: req.body.reporting_person_id,
            reporting_person_name: req.body.reporting_person_name
        });
        await result.save();
        res.json("reported");
    } catch (error) {
        console.log(error);
        res.json(error);
    }
}
exports.getreportbyid = async (req, res) => {
    try {
        const result = await reportModel.find({ $and: [{ postId: req.params.postid }, { reporting_person_id: req.params.userid }] });
        res.json(result);
    } catch (error) {
        console.log(error);
        res.json(error);
    }
}
// Admin api part 

exports.adminlogin = async (req, res) => {
    try {
        const userdata = await adminModel.find({ username: req.body.username });
        if (userdata.length === 1) {
            if (req.body.password === userdata[0].password) {

                res.cookie("adminlogin", userdata[0]._id, {
                    httpOnly: true
                })
                res.json("verified");
            } else {
                res.json("password is incorrect");
            }
        } else {
            res.json("Username Not found!");
        }
    } catch (error) {
        res.json(error);
        console.log(error);

    }
}

exports.isadminlogin = async (req, res) => {
    try {
        // console.log(req.cookies.bloglogin);
        if (req.cookies.adminlogin) {
            const admin = await adminModel.findOne({ _id: req.cookies.adminlogin });
            res.json({
                adminname: admin.username,
                id: admin._id
            });
            // console.log(user);
        } else { res.json("no") }
    } catch (error) {
        console.log(error);
        res.json(error);
    }
}

exports.adminlogout = async (req, res) => {
    try {
        res.clearCookie("adminlogin");
        res.json("deleted");
    } catch (error) {
        console.log(error);
        res.json(error);
    }
}

exports.addcategory = async (req, res) => {
    try {
        const result = await categoryModel({ category: req.body.category });
        await result.save();
        res.json("added");
    } catch (error) {
        console.log(error);
        res.json(error);
    }
}

exports.getcategories = async (req, res) => {
    try {
        const result = await categoryModel.find();
        res.json(result);
    } catch (error) {
        console.log(error);
        res.json(error);
    }
}

exports.deletecategory = async (req, res) => {
    try {
        const result = await categoryModel.findByIdAndDelete(req.params.id);
        res.json("deleted");
    } catch (error) {
        console.log(error);
        res.json(error);
    }
}
//test for post

exports.disableenabletoggle = async (req, res) => {
    try {
        const check = await categoryModel.findById(req.params.id);
        let val;
        if (!check.disable) {
            val = true;
        } else {
            val = false;
        }
        await categoryModel.findByIdAndUpdate({ _id: req.params.id }, {
            disable: val
        })
        res.json("success");
    } catch (error) {
        console.log(error);
        res.json(error);
    }
}

exports.blockpost = async (req, res) => {
    try {
        const check = await postModel.findById(req.params.id);
        if (!check.disable) {
            await postModel.findByIdAndUpdate({ _id: req.params.id }, {
                disable: true,
                message: "This post is blocked by the admin due to incomming reports on this post or it contain improper or fake content!"
            })
        } else {
            await postModel.findByIdAndUpdate({ _id: req.params.id }, {
                disable: false,
                message: ""
            })
        }
        res.json("blocked");
    } catch (error) {
        console.log(error);
        res.json(error);
    }
}

exports.deleteuser = async (req, res) => {
    try {
        const data = await RegisterModule.find({ _id: req.params.id });
        const imageName = data[0].profilepic;
        // console.log(imageName);
        // console.log(req.params.id);
        if (imageName!=="") {
            await cloudinary.uploader.destroy(data[0].cloudinary_id);
        }//deleting user profile image
        await RegisterModule.findByIdAndDelete(req.params.id);//deleting user
        const userposts = await postModel.find({ userId: req.params.id });
        for (let i = 0; i < userposts.length; i++) {//deleting post images
            // console.log(userposts[i].blogimage);
            if (userposts[i].blogimage!=="") {
                await cloudinary.uploader.destroy(userposts[i].cloudinary_id);
            }
        }
        await postModel.deleteMany({ userId: req.params.id });//deleting posts
        await commentModel.deleteMany({ userId: req.params.id });//deleting comments
        res.json("deleted");
    } catch (error) {
        console.log(error);
        res.json(error);
    }
}

exports.getallreports = async (req, res) => {
    try {
        const result = await reportModel.find();
        res.json(result);
    } catch (error) {
        console.log(error);
        res.json(error);
    }
}

exports.getmessages = async (req, res) => {
    try {
        const result = await contactModel.find().sort({ date: -1 });
        res.json(result);
    } catch (error) {
        res.json(error);
        console.log(error);
    }
}

exports.deletemessage = async (req, res) => {
    try {
        await contactModel.findByIdAndDelete(req.params.id);
        res.json("deleted");
    } catch (error) {
        res.json(error);
        console.log(error);
    }
}

exports.setread = async (req, res) => {
    try {
        await contactModel.findByIdAndUpdate({_id:req.params.id},{read:true});
        res.json("updated");
    } catch (error) {
        res.json(error);
        console.log(error);
    }
}