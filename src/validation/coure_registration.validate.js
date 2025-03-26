const Joi = require('joi');

const enrollmentValidationSchema = Joi.object({
    date: Joi.date()
        .required()
        .messages({
            'date.base': 'Date must be a valid date',
            'any.required': 'Date is required'
        }),
    edu_id: Joi.string()
        .uuid()
        .allow(null) // Edu ID bo‘lishi mumkin, lekin shart emas
        .messages({
            'string.base': 'EduCenter ID must be a string',
            'string.uuid': 'EduCenter ID must be a valid UUID'
        }),
    branch_id: Joi.string()
        .uuid()
        .allow(null) // Branch ID bo‘lishi mumkin, lekin shart emas
        .messages({
            'string.base': 'Branch ID must be a string',
            'string.uuid': 'Branch ID must be a valid UUID'
        })
}).custom((value, helpers) => {
    if ((!value.edu_id && !value.branch_id) || (value.edu_id && value.branch_id)) {
        return helpers.message("Either 'edu_id' or 'branch_id' must be provided, but not both");
    }
    return value;
});

module.exports = enrollmentValidationSchema;
