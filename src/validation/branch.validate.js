const Joi = require('joi');

const branchValidationSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(100)
        .required()
        .messages({
            'string.base': 'Name must be a string',
            'string.empty': 'Name is required',
            'string.min': 'Name must be at least 3 characters long',
            'string.max': 'Name cannot exceed 100 characters'
        }),
    phone: Joi.string()
        .pattern(/^\+?[1-9]\d{1,14}$/)
        .required()
        .messages({
            'string.base': 'Phone must be a string',
            'string.empty': 'Phone is required',
            'string.pattern.base': 'Phone must be a valid phone number (e.g., +1234567890)'
        }),
    image: Joi.string()
        .uri()
        .required()
        .messages({
            'string.base': 'Image must be a string',
            'string.empty': 'Image is required',
            'string.uri': 'Image must be a valid URL'
        }),
    address: Joi.string()
        .min(5)
        .max(255)
        .required()
        .messages({
            'string.base': 'Address must be a string',
            'string.empty': 'Address is required',
            'string.min': 'Address must be at least 5 characters long',
            'string.max': 'Address cannot exceed 255 characters'
        }),
    region_id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'Region ID must be a number',
            'number.integer': 'Region ID must be an integer',
            'number.positive': 'Region ID must be a positive number',
            'any.required': 'Region ID is required'
        })
});

module.exports = branchValidationSchema;