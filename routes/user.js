const express = require("express");
const { User, validateRegisterUser, validateLoginUser, validateUpdateUser } = require("../models/User");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("../middlewares/verifyToken");
const router = express.Router();
const mongoose = require("mongoose");
const { Course } = require("../models/Course");

/**
 * @desc Register
 * @route /api/user/register
 * @method Delete
 * @access public
*/
router.post("/register", asyncHandler(
    async (req, res) => {
        var { error } = validateRegisterUser(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ message: "This email already exist!" });
        }

        const salt = await bcrypt.genSalt(10);
        req.body.passwordHash = await bcrypt.hash(req.body.passwordHash, salt);

        user = new User({
            email: req.body.email,
            name: req.body.name,
            passwordHash: req.body.passwordHash,
        });

        const result = await user.save();
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY);

        const { passwordHash, ...other } = result._doc;
        res.status(201).json({ ...other, token });
    })
)

/**
 * @desc Login
 * @route /api/user/login
 * @method Post
 * @access public
*/
router.post("/login", asyncHandler(
    async (req, res) => {
        var { error } = validateLoginUser(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        let user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isPasswordMatch = await bcrypt.compare(req.body.passwordHash, user.passwordHash);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY
            // ,{ expiresIn: "4d" } if you want to be expired like 4d, 30d, 4m, 45s, 1y...
        );

        const { passwordHash, ...other } = user._doc;
        res.status(200).json({ ...other, token });
    }
))

/**
 * @desc get all users with pagination
 * @route /api/user
 * @method Get
 * @access public
*/
router.get("/", verifyTokenAndAdmin, asyncHandler(
    async (req, res) => {
        const { pageNumber } = req.query;
        console.log(pageNumber);
        
        const usersPerPage = 3;
        var usersList = await User.find()
            .skip((pageNumber - 1) * usersPerPage)
            .limit(usersPerPage).select("-passwordHash");
        res.status(200).json(usersList);
    }
))

/**
 * @desc Get user by id
 * @route /api/user/:id
 * @method get
 * @access public
*/
router.get("/:id", verifyTokenAndAuthorization, asyncHandler(
    async (req, res) => {
        const user = await User.findById(req.params.id).select("-passwordHash");
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: "user not found" });
        }
    }
))

/**
 * @desc Update user
 * @route /api/user/:id
 * @method Put
 * @access public
*/
router.put("/:id", verifyTokenAndAuthorization, asyncHandler(async (req, res) => {
    const { error } = validateUpdateUser(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const user = await User.findByIdAndUpdate(req.params.id, {
        $set: {
            name: req.body.name,
            email: req.body.email,
            passwordHash: req.body.passwordHash,
            avatar: req.body.avatar,
            bio: req.body.bio,
        }
    }, { new: true }).select("-passwordHash");

    res.status(200).json(user);
}))

/**
 * @desc Add course to user
 * @route /api/user/add-course-to-user/:id
 * @method Put
 * @access public
*/
router.put("/add-course-to-user/:id", verifyTokenAndAdmin, asyncHandler(async (req, res) => {
    const { error } = validateUpdateUser(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    // check if all courses ids from client are valid
    const courseIds = req.body.enrolledCourses;
    const validCourses = await Course.find({ '_id': { $in: courseIds } });
    if (validCourses.length !== courseIds.length) {
        return res.status(400).json({ message: "One or more course IDs are invalid" });
    }

    const user = await User.findByIdAndUpdate(req.params.id, {
        $addToSet: {
            enrolledCourses: { $each: courseIds }  // add the new course if not taken
        }
    }, { new: true }).select("-passwordHash");

    await Course.updateMany(
        { _id: { $in: courseIds } }, // to get courses with these IDs
        { $addToSet: { students: req.params.id } } // add user id to students property in course
    );

    res.status(200).json(user);
}))

/**
 * @desc Delete user
 * @route /api/user/:id
 * @method Delete
 * @access public
*/
router.delete("/:id", verifyTokenAndAdmin, asyncHandler(
    async (req, res) => {
        const user = await User.findById(req.params.id);
        if (user) {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: "User has been deleted" });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    }
))

/**
 * @desc send link to user email to reset password
 * @route /api/user/reset-password
 * @method Post
 * @access public
*/
router.post("/reset-password", asyncHandler(
    async (req, res) => {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }

        const secret = process.env.JWT_SECRET_KEY + user.passwordHash;
        const frontLink = req.body.link;

        const token = jwt.sign({ email: user.email, id: user.id }, secret, {
            expiresIn: "10m"
        })

        const link = `${frontLink}/${user.id}/${token}`;

        const trasporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.USER_PASS
            }
        })

        const mailOption = {
            from: process.env.USER_EMAIL,
            to: user.email,
            subject: "Reset Password",
            html: `<div>
                <h4>Click on the link below to reset your password</h4>
                <p>${link}</p>
            </div>`
        }

        trasporter.sendMail(mailOption, function (error, success) {
            if (error) {
                res.status(500).json({ message: "cannot send the link to reset the password" });
            } else {
                console.log("Email sent: " + success.response);
            }
        })

        res.status(200).json({ message: "Check your email to chnage the password" });
    }
))

/**
 * @desc Save the new password
 * @route /api/user/send-new-password/:Id/:token
 * @method Post
 * @access public
*/
router.post("/send-new-password/:id/:token", asyncHandler(async (req, res) => {
    // get user by id
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({ message: "user not found" });
    }

    // check if empty passwords
    if (!req.body.newPassword) {
        return res.status(400).json({ message: "New password cannot be empty" });
    }
    if (!req.body.oldPassword) {
        return res.status(400).json({ message: "Old password cannot be empty" });
    }

    // check is old and new passwords are equal
    const isMatch = await bcrypt.compare(req.body.oldPassword, user.passwordHash);
    if (!isMatch) {
        return res.status(400).json({ message: "Old password is incorrect" });
    }

    const secret = process.env.JWT_SECRET_KEY + user.passwordHash;
    try {
        // verify the token
        jwt.verify(req.params.token, secret);

        // hash new password
        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(req.body.newPassword, salt);

        // update new password in db
        user.passwordHash = newHashedPassword;
        await user.save();

        res.status(200).json({ message: "Password has been changed" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to change your password" });
    }
}
))

module.exports = router;