const express = require("express");
const { Order, validateCreateOrder } = require("../models/Order");
const asyncHandler = require("express-async-handler");
const { User } = require("../models/User");
const { Course } = require("../models/Course");
const router = express.Router();

/**
 * @desc get all orders
 * @route /api/order
 * @method GET
 * @access public
*/
router.get("/", asyncHandler(async (req, res) => {
    const { pageNumber } = req.query;
    const ordersPerPage = 5;
    const orders = await Order.find().skip((pageNumber - 1) * ordersPerPage)
        .limit(ordersPerPage);
    res.status(200).json(orders)
}));

/**
 * @desc get order by id
 * @route /api/order/:id
 * @method GET
 * @access public
*/
router.get("/:id", asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    res.status(200).json(order)
}));


/**
 * @desc create new order
 * @route /api/order
 * @method POST
 * @access public
*/
router.post("/", asyncHandler(async (req, res) => {
    const { error, value } = validateCreateOrder(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const userExists = await User.exists({ _id: value.userId });
    if (!userExists) return res.status(404).json({ message: "User not found" });

    const courseIds = value.items.map(i => i.courseId);
    const coursesCount = await Course.countDocuments({ _id: { $in: courseIds } });
    if (coursesCount !== courseIds.length) {
        return res.status(404).json({ message: "One or more courses not found" });
    }

    const order = await Order.create({
        userId: value.userId,
        items: value.items,
        total: value.total,
        currency: value.currency,
        status: value.status,
        paymentRef: value.paymentRef
    });

    var result = await order.save();

    res.status(201).json(result);
}));

module.exports = router;