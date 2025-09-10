const mongoose = require("mongoose");
const Joi = require("joi");

// Schema
const LessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 120,
        trim: true,
        index: true
    },
    sectionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "CourseSection"
    },
    order: {
        type: Number,
        required: true,
        min: 1
    },
    type: {
        type: String,
        required: true,
        enum: ['video', 'article', 'quiz'],
        default: 'video',
        index: true
    },
    articleContent: {
        type: String,
        trim: true,
    },
    videoUrl: {
        type: String,
        trim: true
    },
    videoDurationSec: {
        type: Number,
        min: 0
    },
    isFree: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

//  Lesson model
const Lesson = mongoose.model("Lesson", LessonSchema);

// validate create Lesson
function validateCreateLesson(obj) {
    const schema = Joi.object({
        title: Joi.string().trim().min(2).max(120).required(),
        type: Joi.string().valid('video', 'article', 'quiz').required(),
        sectionId: Joi.string().required(),
        order: Joi.number().min(1).required(),
        videoUrl: Joi.string().trim().when('type', { is: 'video', then: Joi.required() }),
        articleContent: Joi.string().trim().when('type', { is: 'article', then: Joi.required() }),
        videoDurationSec: Joi.number().min(0).when('type', { is: 'video', then: Joi.required() }),
        isFree: Joi.boolean().required(),
    })

    return schema.validate(obj);
}

// validate update Lesson
function validateUpdateLesson(obj) {
    const schema = Joi.object({
        title: Joi.string().trim().min(2).max(120),
        type: Joi.string().valid('video', 'article', 'quiz'),
        sectionId: Joi.string(),
        order: Joi.number().min(1),
        videoUrl: Joi.string().trim().when('type', { is: 'video', then: Joi.required() }),
        articleContent: Joi.string().trim().when('type', { is: 'article', then: Joi.required() }),
        videoDurationSec: Joi.number().min(0).when('type', { is: 'video', then: Joi.required() }),
        isFree: Joi.boolean()
    })

    return schema.validate(obj);
}

module.exports = {
    Lesson,
    validateCreateLesson,
    validateUpdateLesson
}