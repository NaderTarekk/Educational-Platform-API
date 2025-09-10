const express = require("express");
const { CourseSection, validateCreateCourseSection, validateUpdateCourseSection } = require("../models/CourseSection");
const { Course } = require("../models/Course");
const asyncHandler = require("express-async-handler");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");
const router = express.Router();

/**
 * @desc get all sections by course id
 * @route /api/course/section/courseSections/:Id
 * @method GET
 * @access public
*/
router.get("/courseSections/:id", asyncHandler(async (req, res) => {
    const sections = await CourseSection.find({ courseId: req.params.id });
    res.status(200).send(sections)
}));

router.get("/:id", asyncHandler(async (req, res) => {
    const section = await CourseSection.findById(req.params.id);
    if (!section) {
        return res.status(404).json({ message: "Section not found" });
    }
    res.status(200).send(section);
}));

/**
 * @desc create new section
 * @route /api/course/section
 * @method POST
 * @access public
*/
router.post("/", verifyTokenAndAdmin, asyncHandler(async (req, res) => {
    const { error } = validateCreateCourseSection(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    var isExistCourseId = await Course.findById(req.body.courseId);
    if (!isExistCourseId) {
        return res.status(404).json({ message: "Course not found" });
    }

    var isExistOrder = await CourseSection.findOne({ order: req.body.order });
    if (isExistOrder) {
        return res.status(400).json({ message: "Order was taken from another section" });
    }

    const section = new CourseSection({
        title: req.body.title,
        courseId: req.body.courseId,
        order: req.body.order,
    });
    var result = await section.save();

    res.status(201).json(result);
}));

/**
 * @desc update section
 * @route /api/course/section/:id
 * @method PUT
 * @access public
*/
router.put("/:id", verifyTokenAndAdmin, asyncHandler(async (req, res) => {
    const { error } = validateUpdateCourseSection(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    // check if exist order
    if (req.body.order) {
        const getSection = await CourseSection.findById(req.params.id);

        if (req.body.order === getSection.order) { }
        else {
            const isExistOrder = await CourseSection.findOne({ order: req.body.order });
            if (isExistOrder) {
                return res.status(400).json({ message: "This order is already taken" });
            }
        }
    }

    const section = await CourseSection.findByIdAndUpdate(req.params.id, {
        $set: {
            title: req.body.title,
            order: req.body.order
        }
    }, { new: true });

    res.status(200).json(section);
}));

router.delete("/:id", verifyTokenAndAdmin, asyncHandler(async (req, res) => {
    const section = await CourseSections.findById(req.params.id);
    if (section) {
        await CourseSections.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Section has been deleted" });
    } else {
        res.status(404).json({ message: "Section not found" });
    }
}))

module.exports = router;