const express = require("express");
const { Course, validateCreateCourse, validateUpdateCourse } = require("../models/Course");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");

router.get("/", async (req, res) => {
    const { pageNumber } = req.query;
    const coursesPerPage = 3;

    const courses = await Course.find()
        // .populate(["students", { 
        .populate({
            path: 'sections',
            select: 'title order',
            options: { sort: { order: 1 } }
        })
        .lean({ virtuals: true }).skip((pageNumber - 1) * coursesPerPage)
        .limit(coursesPerPage);

    res.status(200).json(courses);
})

router.get("/:id", asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course) {
        return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).send(course);
}));

router.post("/", verifyTokenAndAdmin, asyncHandler(async (req, res) => {
    const { error } = validateCreateCourse(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const course = new Course({
        title: req.body.title,
        slug: req.body.slug,
        description: req.body.description,
        categoryId: req.body.categoryId,
        instructorId: req.body.instructorId,
        price: req.body.price,
        discount: req.body.discount,
        thumbnail: req.body.thumbnail,
        promoVideoUrl: req.body.promoVideoUrl,
        status: req.body.status || "draft"
    });
    var result = await course.save();

    res.status(201).json(result);
}))

router.put("/:id", verifyTokenAndAdmin, asyncHandler(async (req, res) => {
    const { error } = validateUpdateCourse(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const course = await Course.findByIdAndUpdate(req.params.id, {
        $set: {
            title: req.body.title,
            slug: req.body.slug,
            description: req.body.description,
            categoryId: req.body.categoryId,
            instructorId: req.body.instructorId,
            price: req.body.price,
            discount: req.body.discount,
            thumbnail: req.body.thumbnail,
            promoVideoUrl: req.body.promoVideoUrl,
            status: req.body.status,
            ratingAvg: req.body.ratingAvg
        }
    }, { new: true });

    res.status(200).json(course);
}));

router.delete("/:id", verifyTokenAndAdmin, asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (course) {
        await Course.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Course has been deleted" });
    } else {
        res.status(404).json({ message: "Course not found" });
    }
}));

module.exports = router;