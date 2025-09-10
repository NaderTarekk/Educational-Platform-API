const Joi = require("joi");
const mongoose = require("mongoose");

const QuizAttemptSchema = new mongoose.Schema({
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
        required: true,
        index: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    answers: [{
        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question",
            required: true
        },
        answer: {
            type: String,
            trim: true,
            required: true
        }
    }],
    score: { type: Number, min: 0, default: 0 },
    startedAt: { type: Date, default: Date.now },
    submittedAt: { type: Date },
    passed: { type: Boolean, default: false }
}, { timestamps: true });

// indexes
QuizAttemptSchema.index({ quizId: 1, userId: 1, submittedAt: -1 });

// if you want to only 1 try for user 
// QuizAttemptSchema.index({ quizId: 1, userId: 1 }, { unique: true });

function validateCreateAttempt(obj) {
    const schema = Joi.object({
        quizId: Joi.required(),
        userId: Joi.required(),
        answers: Joi.array().items(
            Joi.object({
                questionId: Joi.required(),
                answer: Joi.string().min(1).required()
            })
        ).min(0).default([]),
        score: Joi.number().min(0).default(0),
        startedAt: Joi.date().default(() => new Date()).optional(),
        submittedAt: Joi.date().optional(),
        passed: Joi.boolean().default(false)
    }).custom((val, helpers) => {
        // to prevent repetition of questionId
        const ids = (val.answers || []).map(a => String(a.questionId));
        if (new Set(ids).size !== ids.length) {
            return helpers.error("any.invalid", { message: "Duplicate questionId in answers" });
        }
        // if submittedAt >= startedAt
        if (val.submittedAt && val.startedAt && val.submittedAt < val.startedAt) {
            return helpers.error("any.invalid", { message: "submittedAt cannot be before startedAt" });
        }
        return val;
    });

    return schema.validate(obj, { abortEarly: false, stripUnknown: true });
}

const QuizAttemp = mongoose.model("QuizAttempt", QuizAttemptSchema);
module.exports = { QuizAttemp, validateCreateAttempt };
