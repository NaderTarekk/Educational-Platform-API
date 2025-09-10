const express = require("express");
const { QuizAttemp, validateCreateAttempt } = require("../models/QuizAttemp");
const asyncHandler = require("express-async-handler");
const { CourseSection } = require("../models/CourseSection");
const { User } = require("../models/User");
const { Quiz } = require("../models/Quiz");
const router = express.Router();

/**
 * @desc get all quiz attemps by id
 * @route /api/course/quizz/quizAttemp/:id
 * @method GET
 * @access public
*/
router.get("/:id", asyncHandler(async (req, res) => {
    const question = await QuizAttemp.findById(req.params.id);
    res.status(200).json(question)
}));

/**
 * @desc get all quiz attemps by user id
 * @route /api/course/quizz/quizAttemp/userId/:id
 * @method GET
 * @access public
*/
router.get("/userId/:id", asyncHandler(async (req, res) => {
    const quizzes = await QuizAttemp.find({ userId: req.params.id });
    res.status(200).json(quizzes)
}));

/**
 * @desc create new quiz attemp
 * @route /api/course/quizz/quizAttemp
 * @method POST
 * @access public
*/
router.post("/", asyncHandler(async (req, res) => {
    const { error } = validateCreateAttempt(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const userExist = await User.findById(req.body.userId);
    if (!userExist) {
        return res.status(404).json({ message: "User not found" });
    }

    const quizExist = await Quiz.findById(req.body.quizId);
    if (!quizExist) {
        return res.status(404).json({ message: "Quiz not found" });
    }

    const quizAttemp = new QuizAttemp({
        quizId: req.body.quizId,
        userId: req.body.userId,
        answers: req.body.answers,
        passed: req.body.passed,
        startedAt: req.body.startedAt,
        submittedAt: req.body.submittedAt,
    });
    var result = await quizAttemp.save();

    res.status(201).json(result);
}));

module.exports = router;