const Joi = require('joi');

const ResourceValidationSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(100)
        .required()
        .messages({
            'string.base': 'Name must be a string',
            'string.empty': 'Name is required',
            'string.min': 'Name must be at least 3 characters long',
            'string.max': 'Name must not exceed 100 characters',
            'any.required': 'Name is required'
        }),
    image: Joi.string()
        .uri()
        .required()
        .messages({
            'string.base': 'Image must be a string',
            'string.empty': 'Image URL is required',
            'string.uri': 'Image must be a valid URL',
            'any.required': 'Image URL is required'
        }),
    file: Joi.string()
        .uri()
        .required()
        .messages({
            'string.base': 'File must be a string',
            'string.empty': 'File URL is required',
            'string.uri': 'File must be a valid URL',
            'any.required': 'File URL is required'
        }),
    link: Joi.string()
        .uri()
        .required()
        .messages({
            'string.base': 'Link must be a string',
            'string.empty': 'Link URL is required',
            'string.uri': 'Link must be a valid URL',
            'any.required': 'Link URL is required'
        }),
    description: Joi.string()
        .min(10)
        .max(1000)
        .required()
        .messages({
            'string.base': 'Description must be a string',
            'string.empty': 'Description is required',
            'string.min': 'Description must be at least 10 characters long',
            'string.max': 'Description must not exceed 1000 characters',
            'any.required': 'Description is required'
        }),
    category_id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'Category ID must be a number',
            'number.integer': 'Category ID must be an integer',
            'number.positive': 'Category ID must be a positive number',
            'any.required': 'Category ID is required'
        }),
    user_id: Joi.string()
        .uuid()
        .required()
        .messages({
            'string.base': 'User ID must be a string',
            'string.empty': 'User ID is required',
            'string.uuid': 'User ID must be a valid UUID',
            'any.required': 'User ID is required'
        })
});

module.exports = ResourceValidationSchema
