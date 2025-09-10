const express = require("express");
const { Question, validateUpdateQuestion, validateCreateQuestion } = require("../models/Question");
const asyncHandler = require("express-async-handler");
const { CourseSection } = require("../models/CourseSection");
const { User } = require("../models/User");
const router = express.Router();

/**
 * @desc get question by question id
 * @route /api/course/quizz/question/:id
 * @method GET
 * @access public
*/
router.get("/:id", asyncHandler(async (req, res) => {
    const question = await Question.find({ _id: req.params.id });
    res.status(200).json(question)
}));

/**
 * @desc get all questions by quiz id
 * @route /api/course/quizz/question/:id
 * @method GET
 * @access public
*/
router.get("/quizId/:id", asyncHandler(async (req, res) => {
    const question = await Question.find({ quizId: req.params.id });
    res.status(200).json(question)
}));

/**
 * @desc create new question
 * @route /api/course/quizz/question
 * @method POST
 * @access public
*/
router.post("/", asyncHandler(async (req, res) => {
    const { error } = validateCreateQuestion(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const question = new Question({
        prompt: req.body.prompt,
        type: req.body.type,
        quizId: req.body.quizId,
        options: req.body.options,
        correctAnswer: req.body.correctAnswer,
        points: req.body.points,
    });
    var result = await question.save();

    res.status(201).json(result);
}));

/**
 * @desc update question
 * @route /api/course/quizz/question/:id
 * @method PUT
 * @access public
*/
router.put("/:id", async (req, res) => {
    console.log(req.body.options);

    const { error } = validateUpdateQuestion(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const question = await Question.findByIdAndUpdate(req.params.id, {
        $set: {
            prompt: req.body.prompt,
            type: req.body.type,
            options: req.body.options,
            correctAnswer: req.body.correctAnswer,
            points: req.body.points
        }
    }, { new: true });

    res.status(200).json(question);
})

/**
 * @desc delete question
 * @route /api/course/quizz/question/:id
 * @method DELETE
 * @access public
*/
router.delete("/:id", asyncHandler(async (req, res) => {
    const question = await Question.findById(req.params.id);
    if (question) {
        await Question.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Question has been deleted" });
    } else {
        res.status(404).json({ message: "Question not found" });
    }
}));

module.exports = router;