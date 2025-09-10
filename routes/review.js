const express = require("express");
const { Review, validateCreateReview } = require("../models/Review");
const asyncHandler = require("express-async-handler");
const { User } = require("../models/User");
const { Course } = require("../models/Course");
const { ensureUniqueReview } = require("../middlewares/ensureUniqueReview");
const { verifyTokenAndAdmin, verifyTokenAndAuthorization } = require("../middlewares/verifyToken");
const router = express.Router();

/**
 * @desc get all review
 * @route /api/course/review
 * @method GET
 * @access public
*/
router.get("/", verifyTokenAndAdmin, asyncHandler(async (req, res) => {
    const { pageNumber } = req.query;
    const reviewsPerPage = 3;
    const reviews = await Review.find().skip((pageNumber - 1) * reviewsPerPage)
        .limit(reviewsPerPage);
    res.status(200).json(reviews);
}));

/**
 * @desc get review by user id
 * @route /api/course/review/:id
 * @method GET
 * @access public
*/
router.get("/:id", verifyTokenAndAdmin, asyncHandler(async (req, res) => {
    const review = await Review.find({ userId: req.params.id });
    res.status(200).json(review)
}));


/**
 * @desc create new review
 * @route /api/course/review
 * @method POST
 * @access public
*/
router.post("/", verifyTokenAndAuthorization, ensureUniqueReview, asyncHandler(async (req, res) => {
    const { error } = validateCreateReview(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const userExist = await User.findById(req.body.userId);
    if (!userExist) {
        return res.status(404).json({ message: "User not found" });
    }

    const courseExist = await Course.findById(req.body.courseId);
    if (!courseExist) {
        return res.status(404).json({ message: "Course not found" });
    }

    const review = new Review({
        userId: req.body.userId,
        courseId: req.body.courseId,
        comment: req.body.comment,
        rating: req.body.rating,
    });
    var result = await review.save();

    res.status(201).json(result);
}));

module.exports = router;