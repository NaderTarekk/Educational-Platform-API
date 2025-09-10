const mongoose = require("mongoose");
const Joi = require("joi");

// Schema
const QuizSchema = new mongoose.Schema({
    sectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CourseSection",
        required: true,
    },
    title:
    {
        type: String,
        minLength: 5,
        maxLength: 100,
        trim: true,
        required: true,
    },
    timeLimit:
    {
        type: Number,
        min: 0,
        required: true
    },
    totalPoints: {
        type: Number,
        required: true,
        min: 1  
    }
}, { timestamps: true })



//  Quiz model
const Quiz = mongoose.model("Quizz", QuizSchema);

// validate create Quiz
function validateCreateQuiz(obj) {
    const schema = Joi.object({
        sectionId: Joi.string().required(),
        title: Joi.string().min(5).max(100).trim().required(),
        timeLimit: Joi.number().min(0).required(),
        totalPoints: Joi.number().min(1).required(),
    });

    return schema.validate(obj);
}

// validate update Quiz
function validateUpdateQuiz(obj) {
    const schema = Joi.object({
        title: Joi.string().min(5).max(100).trim(),
        timeLimit: Joi.number().min(0),
        totalPoints: Joi.number().min(1),
    });

    return schema.validate(obj);
}

module.exports = {
    Quiz,
    validateCreateQuiz,
    validateUpdateQuiz
}