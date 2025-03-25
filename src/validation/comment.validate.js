const Joi = require('joi');

const CommentValidationSchema = Joi.object({
    text: Joi.string()
        .min(5)
        .max(1000)
        .required()
        .messages({
            'string.base': 'Comment text must be a string',
            'string.empty': 'Comment text is required',
            'string.min': 'Comment text must be at least 5 characters long',
            'string.max': 'Comment text must not exceed 1000 characters',
            'any.required': 'Comment text is required'
        }),
    star: Joi.number()
        .integer()
        .min(1)
        .max(5)
        .required()
        .messages({
            'number.base': 'Star rating must be a number',
            'number.integer': 'Star rating must be an integer',
            'number.min': 'Star rating must be at least 1',
            'number.max': 'Star rating must not exceed 5',
            'any.required': 'Star rating is required'
        }),
    edu_id: Joi.string()
        .uuid()
        .required()
        .messages({
            'string.base': 'EduCenter ID must be a string',
            'string.empty': 'EduCenter ID is required',
            'string.uuid': 'EduCenter ID must be a valid UUID',
            'any.required': 'EduCenter ID is required'
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

module.exports = CommentValidationSchema