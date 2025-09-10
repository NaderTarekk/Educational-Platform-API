const mongoose = require("mongoose");
const Joi = require("joi");

// Schema
const courseSectionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 120,
        trim: true,
        index: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Course"
    },
    order: {
        type: Number,
        required: true,
        min: 1
    }
}, {
    timestamps: true
})

// Course Section model
const CourseSection = mongoose.model("CourseSection", courseSectionSchema);

// validate create Course Section
function validateCreateCourseSection(obj) {
    const schema = Joi.object({
        title: Joi.string().trim().min(2).max(120).required(),
        courseId: Joi.string().required(),
        order: Joi.number().integer().min(1).required(),
    })

    return schema.validate(obj);
}

// validate update Course Section
function validateUpdateCourseSection(obj) {
    const schema = Joi.object({
        title: Joi.string().trim().min(2).max(120),
        courseId: Joi.string(),
        order: Joi.number().integer().min(1),
    })

    return schema.validate(obj);
}

module.exports = {
    CourseSection,
    validateCreateCourseSection,
    validateUpdateCourseSection
}