const Joi = require("joi");

const ResCategoryValidationSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.base": "Name must be a string",
    "string.empty": "Name is required",
    "string.min": "Name must be at least 3 characters long",
    "string.max": "Name must not exceed 50 characters",
    "any.required": "Name is required",
  }),
  image: Joi.string().uri().required().messages({
    "string.base": "Image must be a string",
    "string.empty": "Image URL is required",
    "string.uri": "Image must be a valid URL",
    "any.required": "Image URL is required",
  }),
});

module.exports = ResCategoryValidationSchema;
