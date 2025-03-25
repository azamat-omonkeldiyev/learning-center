const Joi = require('joi');

const subjectsOfEduValidationSchema = Joi.object({
    edu_id: Joi.string()
        .uuid()
        .required()
        .messages({
            'string.base': 'EduCenter ID must be a string',
            'string.empty': 'EduCenter ID is required',
            'string.uuid': 'EduCenter ID must be a valid UUID'
        }),
    subject_id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'Subject ID must be a number',
            'number.integer': 'Subject ID must be an integer',
            'number.positive': 'Subject ID must be a positive number',
            'any.required': 'Subject ID is required'
        })
});

module.exports = subjectsOfEduValidationSchema;