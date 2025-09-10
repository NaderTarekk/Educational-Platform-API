const mongoose = require("mongoose");
const Joi = require("joi");

// Schema
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxlength: 100,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        minLength: 5,
        maxLength: 100,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true,
        minLength: 6,
        trim: true
    },
    role: {
        type: String,
        enum: ['student', 'instructor', 'admin'],
        default: "student"
    },
    avatar: {
        type: String
    },
    bio: {
        type: String,
        minLength: 10,
        trim: true
    },
    // enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    }
})

UserSchema.virtual('UserRole').get(function () { // to return this NameAndEmail with properties but not saved in the DB and make the id like this : id not  _id
  return `${this.name} is ${this.role}`;
});


// User model
const User = mongoose.model("User", UserSchema);

// validate create User
function validateCreateUser(obj) {
    const schema = Joi.object({
        name: Joi.string().trim().min(3).max(100).required(),
        email: Joi.string().trim().min(5).max(100).required(),
        passwordHash: Joi.string().trim().min(6).required(),
        avatar: Joi.string(),
        bio: Joi.string().min(10),
        role: Joi.string().valid('student', 'instructor', 'admin'),
        enrolledCourses: Joi.array().items(Joi.string().length(24).hex())
    })

    return schema.validate(obj);
}

// validate update User
function validateUpdateUser(obj) {
    const schema = Joi.object({
        name: Joi.string().trim().min(3).max(100),
        email: Joi.string().trim().min(5).max(100),
        passwordHash: Joi.string().trim().min(6),
        avatar: Joi.string(),
        bio: Joi.string().min(10),
        enrolledCourses: Joi.array().items(Joi.string().length(24).hex())
    });

    return schema.validate(obj);
}

// validate register
function validateRegisterUser(obj) {
    const schema = Joi.object({
        email: Joi.string().trim().min(5).max(100).required().email(),
        name: Joi.string().trim().min(3).max(100).required(),
        passwordHash: Joi.string().trim().min(6).required()
    })
    return schema.validate(obj)
}

// validate login
function validateLoginUser(obj) {
    const schema = Joi.object({
        email: Joi.string().trim().min(5).max(100).required().email(),
        passwordHash: Joi.string().trim().min(6).required(),
    })
    return schema.validate(obj)
}

module.exports = {
    User,
    validateCreateUser,
    validateUpdateUser,
    validateLoginUser,
    validateRegisterUser
}