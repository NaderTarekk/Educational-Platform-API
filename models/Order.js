const mongoose = require("mongoose");
const Joi = require("joi");

const OrderItemSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  pricePaid: {
    type: Number,
    min: 0,
    required: true,
  },
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  items: {
    type: [OrderItemSchema],
    required: true,
  },
  total: { type: Number, min: 0, required: true },
  currency: { type: String, trim: true, uppercase: true, minlength: 3, maxlength: 3, required: true }, // USD / SAR / EGP
  status: { type: String, enum: ["pending", "paid", "failed"], default: "pending", required: true },
  paymentRef: { type: String, trim: true },
}, { timestamps: true });

OrderSchema.index({ userId: 1, createdAt: -1 });

const Order = mongoose.model("Order", OrderSchema);

function validateCreateOrder(obj) {
  const schema = Joi.object({
    userId: Joi.string().required(),
    items: Joi.array().items(
      Joi.object({
        courseId: Joi.string().required(),
        pricePaid: Joi.number().min(0).required()
      })
    ).min(1).required(),
    total: Joi.number().min(0).required(),
    currency: Joi.string().uppercase().length(3).required(), 
    status: Joi.string().valid("pending", "paid", "failed").required(),
    paymentRef: Joi.string().max(100)
  });

  return schema.validate(obj);
}

module.exports = {
  Order,
  validateCreateOrder
};
