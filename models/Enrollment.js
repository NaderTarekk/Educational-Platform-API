const mongoose = require("mongoose");
const Joi = require("joi");

// Schema
const EnrollmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
        index: true
    },
    lastLessonId:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson"
    },
    progressPct:
    {
        type: Number,
        default: 0
    },
    completedAt: Date
}, { timestamps: true })

// to not store the same user id with course id twice 
EnrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

//  Enrollment model
const Enrollment = mongoose.model("Enrollment", EnrollmentSchema);

// check if valid objectId
const objectIdValidator = (value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
    }
    return value; 
};

// validate create enrollment
function validateCreateEnrollment(obj) {
    const schema = Joi.object({
        userId: Joi.string().custom(objectIdValidator).required(),
        courseId: Joi.string().custom(objectIdValidator).required(),
        progressPct: Joi.number().min(0).max(100).default(0),
        lastLessonId: Joi.string().custom(objectIdValidator),
        completedAt: Joi.date()
    });

    return schema.validate(obj);
}

// validate update enrollment
function validateUpdateEnrollment(obj) {
    const schema = Joi.object({
        userId: Joi.string().custom(objectIdValidator),
        courseId: Joi.string().custom(objectIdValidator),
        progressPct: Joi.number().min(0).max(100),
        lastLessonId: Joi.string().custom(objectIdValidator),
        completedAt: Joi.date()
    });

    return schema.validate(obj);
}

module.exports = {
    Enrollment,
    validateCreateEnrollment,
    validateUpdateEnrollment
}