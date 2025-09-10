const express = require("express");
const { CourseCategories, validateCreateCourseCategory, validateUpdateCourseCategory } = require("../models/CourseCategory");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");
const router = express.Router();
const asyncHandler = require("express-async-handler");

router.get("/", async (req, res) => {
    const categories = await CourseCategories.find()
    res.status(200).send(categories)
})

router.get("/:id", asyncHandler(async (req, res) => {
    const category = await CourseCategories.findById(req.params.id);
    if (!category) {
        return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).send(category);
}));

router.post("/", verifyTokenAndAdmin, asyncHandler(async (req, res) => {
    const { error } = validateCreateCourseCategory(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const category = new CourseCategories({
        title: req.body.title
    });
    var result = await category.save();

    res.status(201).json(result);
}));

router.put("/:id", verifyTokenAndAdmin, asyncHandler(async (req, res) => {
    const { error } = validateUpdateCourseCategory(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const category = await CourseCategories.findByIdAndUpdate(req.params.id, {
        $set: {
            title: req.body.title
        }
    }, { new: true });

    res.status(200).json(category);
}));

router.delete("/:id", verifyTokenAndAdmin, asyncHandler(async (req, res) => {
    const category = await CourseCategories.findById(req.params.id);
    if (category) {
        await CourseCategories.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Category has been deleted" });
    } else {
        res.status(404).json({ message: "Category not found" });
    }
}));

module.exports = router;