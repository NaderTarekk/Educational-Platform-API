const express = require("express");
const { Enrollment, validateUpdateEnrollment, validateCreateEnrollment } = require("../models/Enrollment");
const asyncHandler = require("express-async-handler");
const { Lesson } = require("../models/Lesson");
const { Course } = require("../models/Course");
const { User } = require("../models/User");
const { verifyTokenAndAdmin, verifyTokenAndAuthorization } = require("../middlewares/verifyToken");
const router = express.Router();

/**
 * @desc get all courses by user id
 * @route /api/course/enrollment/userId/:id
 * @method GET
 * @access public
*/
router.get("/userId/:id", verifyTokenAndAuthorization, asyncHandler(async (req, res) => {
    const courses = await Enrollment.find({ userId: req.params.id });
    res.status(200).send(courses)
}));

/**
 * @desc get all users by course id
 * @route /api/course/enrollment/courseId/:id
 * @method GET
 * @access public
*/
router.get("/courseId/:id", verifyTokenAndAdmin, asyncHandler(async (req, res) => {
    const users = await Enrollment.find({ courseId: req.params.id });
    res.status(200).send(users)
}));

/**
 * @desc create new enrollment
 * @route /api/course/enrollment
 * @method POST
 * @access public
*/
router.post("/", verifyTokenAndAuthorization, asyncHandler(async (req, res) => {
    const { error } = validateCreateEnrollment(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    var isExistCourseId = await Course.findById(req.body.courseId);
    if (!isExistCourseId) {
        return res.status(404).json({ message: "Course not found" });
    }

    var isExistUser = await User.findOne({ _id: req.body.userId });
    if (!isExistUser) {
        return res.status(404).json({ message: "User not found" });
    }

    var isExistEnrollment = await Enrollment.findOne({ userId: req.body.userId, courseId: req.body.courseId });
    if (isExistEnrollment) {
        return res.status(404).json({ message: "User is already in this course" });
    }

    const enrollment = new Enrollment({
        courseId: req.body.courseId,
        userId: req.body.userId
    });
    var result = await enrollment.save();

    res.status(201).json(result);
}));

/**
 * @desc update enrollment
 * @route /api/course/enrollment/update/:id
 * @method PUT
 * @access public
*/
router.put("/update/:id", verifyTokenAndAuthorization, async (req, res) => {
    const { error } = validateUpdateEnrollment(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    var isExistCourseId = await Course.findById(req.body.courseId);
    if (!isExistCourseId) {
        return res.status(404).json({ message: "Course not found" });
    }

    var isExistUser = await User.findOne({ _id: req.body.userId });
    if (!isExistUser) {
        return res.status(404).json({ message: "User not found" });
    }

    var isExistEnrollment = await Enrollment.findOne({ userId: req.body.userId, courseId: req.body.courseId });
    if (!isExistEnrollment) {
        return res.status(404).json({ message: "Wrong user or course" });
    }

    const enrollment = await Enrollment.findByIdAndUpdate(req.params.id, {
        $set: {
            lastLessonId: req.body.lastLessonId,
            progressPct: req.body.progressPct,
            completedAt: req.body.completedAt,
        }
    }, { new: true });

    res.status(200).json(enrollment);
})

/**
 * @desc delete enrollment
 * @route /api/course/enrollment/delete/:id
 * @method DELETE
 * @access public
*/
router.delete("/delete/:id", verifyTokenAndAdmin, asyncHandler(async (req, res) => {
    const enrollment = await Enrollment.findById(req.params.id);
    if (enrollment) {
        await Enrollment.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Enrollment has been deleted" });
    } else {
        res.status(404).json({ message: "Enrollment not found" });
    }
}));

module.exports = router;