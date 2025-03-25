const Joi = require('joi');

const enrollmentValidationSchema = Joi.object({
    user_id: Joi.string()
        .uuid()
        .required()
        .messages({
            'string.base': 'User ID must be a string',
            'string.empty': 'User ID is required',
            'string.uuid': 'User ID must be a valid UUID'
        }),
    date: Joi.date()
        .required()
        .messages({
            'date.base': 'Date must be a valid date',
            'any.required': 'Date is required'
        }),
    edu_id: Joi.string()
        .uuid()
        .required()
        .messages({
            'string.base': 'EduCenter ID must be a string',
            'string.empty': 'EduCenter ID is required',
            'string.uuid': 'EduCenter ID must be a valid UUID'
        }),
    branch_id: Joi.string()
        .uuid()
        .required()
        .messages({
            'string.base': 'Branch ID must be a string',
            'string.empty': 'Branch ID is required',
            'string.uuid': 'Branch ID must be a valid UUID'
        })
});

module.exports = enrollmentValidationSchema;