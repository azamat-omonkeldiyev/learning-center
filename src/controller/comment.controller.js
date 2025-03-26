const Comment = require('../models/comment.model')
const User = require('../models/user.model')
const EduCenter = require('../models/edu_center.model')

const CommentValidationSchema = require("../validation/comment.validate");
const { Op } = require("sequelize");

const getComments = async (req, res) => {
    try {
        const { page, limit, sortField, sortOrder, text, star, edu_id, user_id } = req.query;

        const queryOptions = {
            include: [
                { model: User, attributes: ["id", "name"] },
                { model: EduCenter, attributes: ["id", "name"] }
            ],
            where: {},
            order: [],
        };

        if (page && limit) {
            queryOptions.limit = parseInt(limit);
            queryOptions.offset = (parseInt(page) - 1) * parseInt(limit);
        }

        if (sortField && sortOrder) {
            queryOptions.order.push([
                sortField,
                sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC",
            ]);
        } else {
            queryOptions.order.push(["createdAt", "ASC"]);
        }

        if (text) {
            queryOptions.where.text = { [Op.like]: `%${text}%` };
        }
        if (star) {
            queryOptions.where.star = star;
        }
        if (edu_id) {
            queryOptions.where.edu_id = edu_id;
        }
        if (user_id) {
            queryOptions.where.user_id = user_id;
        }

        const comments = await Comment.findAndCountAll(queryOptions);

        const response = {
            data: comments.rows,
            total: comments.count,
        };

        if (page && limit) {
            response.page = parseInt(page);
            response.totalPages = Math.ceil(comments.count / limit);
        }

        res.json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const getComment = async (req, res) => {
    try {
        const comment = await Comment.findByPk(req.params.id, {
            include: [
                { model: User, attributes: ["id", "name"] },
                { model: EduCenter, attributes: ["id", "name"] }
            ],
        });
        if (!comment) return res.status(404).json({ error: "Comment not found" });

        res.json(comment);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const createComment = async (req, res) => {
    try {
        const { error } = CommentValidationSchema.validate(req.body, {
            abortEarly: false,
        });
        if (error) {
            return res
                .status(400)
                .json({ message: error.details.map((detail) => detail.message) });
        }

        const comment = await Comment.create(req.body);
        res.status(201).json(comment);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const updateComment = async (req, res) => {
    try {
        const comment = await Comment.findByPk(req.params.id);
        if (!comment) return res.status(404).json({ error: "Comment not found" });

        const { error } = CommentValidationSchema.validate(req.body, {
            abortEarly: false,
        });
        if (error) {
            return res
                .status(400)
                .json({ message: error.details.map((detail) => detail.message) });
        }

        await comment.update(req.body);
        res.json(comment);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findByPk(req.params.id);
        if (!comment) return res.status(404).json({ error: "Comment not found" });

        await comment.destroy();
        res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getComments,
    getComment,
    createComment,
    updateComment,
    deleteComment,
};