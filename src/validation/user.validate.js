const Joi = require("joi");

const userValidationSchema = Joi.object({
    fullname: Joi.string()
        .min(3).max(50)
        .required()
        .messages({
            "string.empty": "Name is required",
            "string.min": "Name must be at least 3 characters long",
            "string.max": "Name cannot be longer than 50 characters"
        }),
    phone: Joi.string()
        .pattern(/^\+998\d{9}$/)
        .required()
        .messages({
            "string.pattern.base": "Phone number must be in the format +998XXXXXXXXX",
            "string.empty": "Phone number is required"
        }),
    email: Joi.string()
        .email()
        .required()
        .messages({
            "string.email": "Invalid email format",
            "string.empty": "Email is required"
        }),
    region_id: Joi.number()
        .integer()
        .required()
        .messages({
            "number.base": "Region ID must be a number",
            "any.required": "Region ID is required"
        }),
    password: Joi.string()
        .min(8)
        .max(128)
        .required()
        .messages({
            "string.empty": "Password is required",
            "string.min": "Password must be at least 8 characters long",
            "string.max": "Password cannot be longer than 128 characters"
        }),
    image: Joi.string()
        .uri()
        .required()
        .messages({
            "string.uri": "Image must be a valid URL",
            "string.empty": "Image is required"
        }),
    role: Joi.string()
        .valid("ceo", "user", "admin", "superadmin")
        .required()
        .messages({
            "any.only": "Role must be one of: ceo, user, admin, superadmin",
            "string.empty": "Role is required"
        })
}).strict();

module.exports = userValidationSchema;
