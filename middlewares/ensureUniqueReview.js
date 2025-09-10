const { Review } = require("../models/Review");

async function ensureUniqueReview(req, res, next) {
    const exists = await Review.exists({ courseId: req.body.courseId, userId: req.body.userId });
    if (exists) return res.status(409).json({ message: "You already reviewed this course" });
    next();
}

module.exports = { ensureUniqueReview };