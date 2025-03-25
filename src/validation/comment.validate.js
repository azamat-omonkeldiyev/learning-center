const Joi = require("joi");

const CommentValidationSchema = Joi.object({
    text: Joi.string()
        .min(5)
        .max(1000)
        .required()
        .messages({
            "string.base": "Comment text must be a string",
            "string.empty": "Comment text is required",
            "string.min": "Comment text must be at least 5 characters long",
            "string.max": "Comment text must not exceed 1000 characters",
            "any.required": "Comment text is required",
        }),

    star: Joi.number()
        .integer()
        .min(1)
        .max(5)
        .required()
        .messages({
            "number.base": "Star rating must be a number",
            "number.integer": "Star rating must be an integer",
            "number.min": "Star rating must be at least 1",
            "number.max": "Star rating must not exceed 5",
            "any.required": "Star rating is required",
        }),

    edu_id: Joi.string()
        .uuid()
        .messages({
            "string.base": "EduCenter ID must be a string",
            "string.uuid": "EduCenter ID must be a valid UUID",
        }),

    branch_id: Joi.string()
        .uuid()
        .messages({
            "string.base": "Branch ID must be a string",
            "string.uuid": "Branch ID must be a valid UUID",
        }),
})
    .or("edu_id", "branch_id") // Kamida bittasi bo‘lishi kerak
    .messages({
        "object.missing": "Either edu_id or branch_id is required",
    })
    .nand("edu_id", "branch_id") // Ikkalasi birga bo‘lsa xatolik chiqaradi
    .messages({
        "object.nand": "You can only provide either edu_id or branch_id, not both",
    });

module.exports = CommentValidationSchema;
