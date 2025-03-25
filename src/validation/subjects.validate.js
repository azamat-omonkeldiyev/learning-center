const Joi = require('joi');

const subjectsValidationSchema = Joi.object({
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
    image: Joi.string()
        .uri()
        .required()
        .messages({
            'string.base': 'Image must be a string',
            'string.empty': 'Image is required',
            'string.uri': 'Image must be a valid URL'
        })
});

module.exports = subjectsValidationSchema;