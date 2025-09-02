const mongoose = require("mongoose");
const Joi = require("joi");

// Schema
const courseCategorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 100,
        trim: true,
        unique: true
    }
}, { timestamps: true })


// Course category model
const CourseCategories = mongoose.model("CourseCategory", courseCategorySchema);

// validate create Course category
function validateCreateCourseCategory(obj) {
    const schema = Joi.object({
        title: Joi.string().trim().min(1).max(200).required()
    })

    return schema.validate(obj);
}

// validate update Course
function validateUpdateCourseCategory(obj) {
    const schema = Joi.object({
        title: Joi.string().trim().min(1).max(100)
    })

    return schema.validate(obj);
}

module.exports = {
    CourseCategories,
    validateCreateCourseCategory,
    validateUpdateCourseCategory
}