const mongoose = require("mongoose");
const Joi = require("joi");

// Schema
const QuestionSchema = new mongoose.Schema({
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
        required: true
    },
    prompt:
    {
        type: String,
        minLength: 5,
        trim: true,
        required: true,
    },
    type: {
        type: String,
        enum: ["mcq", "tf", "text"],
        required: true
    },
    options: [{
        type: String,
        trim: true,
        required: true
    }],
    correctAnswer: {
        type: String,
        trim: true,
        required: true
    },
    points: {
        type: Number,
        min: 1,
        required: true
    }
}, { timestamps: true })

//  Question model
const Question = mongoose.model("Questions", QuestionSchema);

// validate create Question
function validateCreateQuestion(obj) {
    const schema = Joi.object({
        quizId: Joi.string().required(),
        type: Joi.string().valid("mcq", "tf", "text").required().messages({
            "any.only": "Type must be one of: mcq, tf, text",
            "any.required": "Type is required"
        }),
        prompt: Joi.string().min(5).required(),
        options: Joi.when("type", {
            is: "mcq",
            then: Joi.array().items(Joi.string().min(1)).min(2).required(),
            otherwise: Joi.forbidden()
        }),
        correctAnswer: Joi.string().required(),
        points: Joi.number().min(1).required()
    });

    return schema.validate(obj);
}

// validate update Question
function validateUpdateQuestion(obj) {
    const schema = Joi.object({
        type: Joi.string().valid("mcq", "tf", "text"),
        prompt: Joi.string().min(5),
        options: Joi.array().items(Joi.string().min(1)).min(2)
            .when('type', {
                is: 'mcq',
                then: Joi.optional(),
                otherwise: Joi.optional()
            }),
        correctAnswer: Joi.string(),
        points: Joi.number().min(1)
    });

    return schema.validate(obj);
}

module.exports = {
    Question,
    validateCreateQuestion,
    validateUpdateQuestion
}