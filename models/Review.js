const mongoose = require("mongoose");
const Joi = require("joi");

const ReviewSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
        index: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        trim: true,
        maxlength: 1000
    }
}, { timestamps: true });

ReviewSchema.index({ courseId: 1, userId: 1 }, { unique: true });

const Review = mongoose.model("Review", ReviewSchema);

function validateCreateReview(obj) {
    const schema = Joi.object({
        courseId: Joi.string().required(),
        userId: Joi.string().required(),
        rating: Joi.number().integer().min(1).max(5).required().messages({
            "number.min": "rating must be ≥ 1",
            "number.max": "rating must be ≤ 5",
            "number.base": "rating must be a number",
            "any.required": "rating is required"
        }),
        comment: Joi.string().max(1000)
    });
    return schema.validate(obj);
}

module.exports = {
    Review, validateCreateReview
};
