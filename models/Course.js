const mongoose = require("mongoose");
const Joi = require('joi');

// Schema
const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        min: 1,
        maxlength: 100,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        min: 1,
        maxlength: 200,
        trim: true
    },
    description: {
        type: String,
        required: true,
        min: 1,
        trim: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "CourseCategory"
    },
    instructorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    discount: {
        type: Number,
        min: 0
    },
    thumbnail: {
        type: String,
        required: true,
    },
    promoVideoUrl: {
        type: String,
        min: 1
    },
    status: {
        type: String,
        required: true,
        min: 1,
        trim: true
    },
    ratingAvg: {
        type: Number,
        min: 0,
        trim: true
    },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true })


// Course model
const Course = mongoose.model("Course", courseSchema);

// validate create Course
function validateCreateCourse(obj) {
    const schema = Joi.object({
        title: Joi.string().trim().min(1).max(200).required(),
        slug: Joi.string().trim().min(1).max(200).required(),
        description: Joi.string().trim().min(1).required(),
        categoryId: Joi.string().required(),
        instructorId: Joi.string().required(),
        price: Joi.number().min(0).required(),
        discount: Joi.number().min(0),
        thumbnail: Joi.string().required(),
        promoVideoUrl: Joi.string().min(1),
        status: Joi.string().trim().min(1).required(),
        ratingAvg: Joi.number().min(0),
    })

    return schema.validate(obj);
}

// validate update Course
function validateUpdateCourse(obj) {
    const schema = Joi.object({
        title: Joi.string().trim().min(1).max(200),
        slug: Joi.string().trim().min(1).max(200),
        description: Joi.string().trim().min(1),
        categoryId: Joi.string(),
        instructorId: Joi.string(),
        price: Joi.number().min(0),
        discount: Joi.number().min(0),
        thumbnail: Joi.string(),
        promoVideoUrl: Joi.string().min(1),
        status: Joi.string().trim().min(1),
        ratingAvg: Joi.number().min(0),
    })

    return schema.validate(obj);
}

module.exports = {
    Course,
    validateCreateCourse,
    validateUpdateCourse
}