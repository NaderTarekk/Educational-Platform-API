const express = require("express");
const { Quiz, validateUpdateQuiz, validateCreateQuiz } = require("../models/Quiz");
const asyncHandler = require("express-async-handler");
const { CourseSection } = require("../models/CourseSection");
const { verifyTokenAndAuthorization, verifyTokenAdminAndInstructor } = require("../middlewares/verifyToken");
const router = express.Router();

/**
 * @desc get quiz by section id
 * @route /api/course/Quiz/:id
 * @method GET
 * @access public
*/
router.get("/:id", verifyTokenAndAuthorization, asyncHandler(async (req, res) => {
    const quiz = await Quiz.find({ sectionId: req.params.id });
    res.status(200).send(quiz)
}));

/**
 * @desc create new quiz
 * @route /api/course/quiz
 * @method POST
 * @access public
*/
router.post("/", verifyTokenAdminAndInstructor, asyncHandler(async (req, res) => {
    const { error } = validateCreateQuiz(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    var isExistSectionId = await CourseSection.findById(req.body.sectionId);
    if (!isExistSectionId) {
        return res.status(404).json({ message: "Section not found" });
    }

    var isExistQuiz = await Quiz.findOne({ title: req.body.title });
    if (isExistQuiz) {
        return res.status(400).json({ message: "Quiz is already exist for this section" });
    }

    const quiz = new Quiz({
        sectionId: req.body.sectionId,
        title: req.body.title,
        totalPoints: req.body.totalPoints,
        timeLimit: req.body.timeLimit,
    });
    var result = await quiz.save();

    res.status(201).json(result);
}));

/**
 * @desc update quiz
 * @route /api/course/quiz/:id
 * @method PUT
 * @access public
*/
router.put("/:id", verifyTokenAdminAndInstructor, asyncHandler(async (req, res) => {
    const { error } = validateUpdateQuiz(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    var isExistSecionQuz = await Quiz.findOne({ _id: req.params.id, title: req.body.title });
    if (isExistSecionQuz) {
        return res.status(400).json({ message: "Quiz is already exist for this section" });
    }

    var isExistQuiz = await Quiz.findOne({ title: req.body.title });
    if (isExistQuiz) {
        return res.status(400).json({ message: "Quiz title is already exist" });
    }

    const quiz = await Quiz.findByIdAndUpdate(req.params.id, {
        $set: {
            timeLimit: req.body.timeLimit,
            title: req.body.title,
            totalPoints: req.body.totalPoints,
        }
    }, { new: true });

    res.status(200).json(quiz);
}));

/**
 * @desc delete quiz
 * @route /api/course/quiz/:id
 * @method DELETE
 * @access public
*/
router.delete("/:id", verifyTokenAdminAndInstructor, asyncHandler(async (req, res) => {
    const quiz = await Quiz.findById(req.params.id);
    if (quiz) {
        await Quiz.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Quiz has been deleted" });
    } else {
        res.status(404).json({ message: "Quiz not found" });
    }
}));

module.exports = router;