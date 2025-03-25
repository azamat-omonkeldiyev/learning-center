const Joi = require('joi');

const fieldsOfEduValidationSchema = Joi.object({
    edu_id: Joi.string()
        .uuid()
        .required()
        .messages({
            'string.base': 'EduCenter ID must be a string',
            'string.empty': 'EduCenter ID is required',
            'string.uuid': 'EduCenter ID must be a valid UUID'
        }),
    field_id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'Field ID must be a number',
            'number.integer': 'Field ID must be an integer',
            'number.positive': 'Field ID must be a positive number',
            'any.required': 'Field ID is required'
        })
});

module.exports = fieldsOfEduValidationSchema;