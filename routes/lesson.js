const express = require("express");
const { Lesson, validateCreateLesson, validateUpdateLesson } = require("../models/Lesson");
const asyncHandler = require("express-async-handler");
const { CourseSection } = require("../models/CourseSection");
const { verifyTokenAndAdmin, verifyTokenAdminAndInstructor } = require("../middlewares/verifyToken");
const router = express.Router();

/**
 * @desc get all lessons by section id
 * @route /api/course/section/lesson/lessons/:Id
 * @method GET
 * @access public
*/
router.get("/lessons/:id", asyncHandler(async (req, res) => {
    const lessons = await Lesson.find({ sectionId: req.params.id });
    res.status(200).send(lessons)
}));

/**
 * @desc get lesson by id
 * @route /api/course/section/lesson/:id
 * @method GET
 * @access public
*/
router.get("/:id", asyncHandler(async (req, res) => {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
        return res.status(404).json({ message: "lesson not found" });
    }
    res.status(200).send(lesson);
}));

/**
 * @desc create new lesson
 * @route /api/course/section/lesson
 * @method POST
 * @access public
*/
router.post("/", verifyTokenAdminAndInstructor, asyncHandler(async (req, res) => {
    const { error } = validateCreateLesson(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    var isExistCourseId = await CourseSection.findById(req.body.sectionId);
    if (!isExistCourseId) {
        return res.status(404).json({ message: "Section not found" });
    }

    var isExistOrder = await Lesson.findOne({ order: req.body.order });
    if (isExistOrder) {
        return res.status(400).json({ message: "Order was taken from another lesson" });
    }

    const lesson = new Lesson({
        title: req.body.title,
        sectionId: req.body.sectionId,
        order: req.body.order,
        type: req.body.type,
        videoUrl: req.body.videoUrl,
        videoDurationSec: req.body.videoDurationSec,
        articleContent: req.body.articleContent,
        isFree: req.body.isFree,
    });
    var result = await lesson.save();

    res.status(201).json(result);
}));

/**
 * @desc update lesson
 * @route /api/course/section/lesson/:id
 * @method PUT
 * @access public
*/
router.put("/:id", verifyTokenAdminAndInstructor, asyncHandler( async (req, res) => {
    const { error } = validateUpdateLesson(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    // check if exist order
    if (req.body.order) {
        const getlesson = await Lesson.findById(req.params.id);

        if (req.body.order === getlesson.order) { }
        else {
            const isExistOrder = await Lesson.findOne({ order: req.body.order });
            if (isExistOrder) {
                return res.status(400).json({ message: "This order is already taken" });
            }
        }
    }

    const lesson = await Lesson.findByIdAndUpdate(req.params.id, {
        $set: {
            title: req.body.title,
            order: req.body.order,
            type: req.body.type,
            videoDurationSec: req.body.videoDurationSec,
            videoUrl: req.body.videoUrl,
            articleContent: req.body.articleContent,
            isFree: req.body.isFree
        }
    }, { new: true });

    res.status(200).json(lesson);
}));

/**
 * @desc delete lesson
 * @route /api/course/section/lesson/:id
 * @method DELETE
 * @access public
*/
router.delete("/:id", verifyTokenAdminAndInstructor, asyncHandler(async (req, res) => {
    const lesson = await Lesson.findById(req.params.id);
    if (lesson) {
        await Lesson.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Lesson has been deleted" });
    } else {
        res.status(404).json({ message: "Lesson not found" });
    }
}));

module.exports = router;