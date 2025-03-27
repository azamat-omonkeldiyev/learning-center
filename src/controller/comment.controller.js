const Comment = require("../models/comment.model");
const User = require("../models/user.model");
const EduCenter = require("../models/edu_center.model");
const Branch = require("../models/branch.model");
const logger = require('../config/logger')
const CommentValidationSchema = require("../validation/comment.validate");
const { Op } = require("sequelize");

const getComments = async (req, res) => {
    try {
        logger.info("Fetching comments", {
            query: req.query,
            userId: req.userId || "unauthenticated",
          });
        const { page, limit, sort, text, star, edu_id, branch_id, user_id } = req.query;

        const queryOptions = {
            include: [
                { model: User, attributes: ["id", "fullname"] },
                { model: EduCenter, attributes: ["id", "name"] },
                { model: Branch, attributes: ["id", "name"] }
            ],
            where: {},
            order: [],
        };

        if (page && limit) {
            queryOptions.limit = parseInt(limit);
            queryOptions.offset = (parseInt(page) - 1) * parseInt(limit);
        }

        let sortField = "createdAt"; // Default tartiblash maydoni
        let sortOrder = "ASC"; 

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
        if (branch_id) {
            queryOptions.where.branch_id = branch_id;
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
        logger.info("Comments fetched successfully", {
            total: comments.count,
            userId: req.userId || "unauthenticated",
          });
        res.json(response);
    } catch (error) {
        throw error
    }
};

const getComment = async (req, res) => {
    try {
        logger.info("Fetching comment by ID", {
            commentId: req.params.id,
            userId: req.userId || "unauthenticated",
          });
        const comment = await Comment.findByPk(req.params.id, {
            include: [
                { model: User, attributes: ["id", "name"] },
                { model: EduCenter, attributes: ["id", "name"] },
                { model: Branch, attributes: ["id", "name"] }
            ],
        });
        if (!comment) return res.status(404).json({ error: "Comment not found" });
        logger.info("Comment fetched successfully", {
            commentId: req.params.id,
            userId: req.userId || "unauthenticated",
          });
        res.json(comment);
    } catch (error) {
        throw error
    }
};

const createComment = async (req, res) => {
    try {
        logger.info("Creating comment", {
            body: req.body,
            userId: req.userId || "unauthenticated",
          });
        const { error } = CommentValidationSchema.validate(req.body, {
            abortEarly: false,
        });
        if (error) {
            logger.warn("Comment creation failed: Validation error", {
                error: error.details.map((detail) => detail.message),
                userId: req.userId || "unauthenticated",
              });
            return res
                .status(400)
                .json({ message: error.details.map((detail) => detail.message) });
        }

        const find = await EduCenter.findByPk(req.body.edu_id);
        if (!find) return res.status(404).json({message:"edu-center not found"})

        const comment = await Comment.create({...req.body,user_id:req.userId});
        logger.info("Comment created successfully", {
            commentId: comment.id,
            userId: req.userId || "unauthenticated",
          });
        res.status(201).json(comment);
    } catch (error) {
        throw error
    }
};

const updateComment = async (req, res) => {
    try {
        logger.info("Updating comment", {
            commentId: req.params.id,
            body: req.body,
            userId: req.userId || "unauthenticated",
          });
        const comment = await Comment.findByPk(req.params.id);
        if (!comment) return res.status(404).json({ error: "Comment not found" });

        if (req.userRole !== "admin" || req.userRole !== "superadmin" && req.userId !== comment.user_id) {
            return res.status(403).json({ error: "You can only update your own comments" });
        }

        const { error } = CommentValidationSchema.validate(req.body, {
            abortEarly: false,
        });
        if (error) {
            logger.warn("Comment update failed: Validation error", {
                error: error.details.map((detail) => detail.message),
                userId: req.userId || "unauthenticated",
              });
            return res
                .status(400)
                .json({ message: error.details.map((detail) => detail.message) });
        }

        await comment.update(req.body);
        logger.info("Comment updated successfully", {
            commentId: req.params.id,
            userId: req.userId || "unauthenticated",
          });
        res.json(comment);
    } catch (error) {
        throw error
    }
};

const deleteComment = async (req, res) => {
    try {
        logger.info("Deleting comment", {
            commentId: req.params.id,
            userId: req.userId || "unauthenticated",
          });
        const comment = await Comment.findByPk(req.params.id);
        if (!comment) return res.status(404).json({ error: "Comment not found" });

        if (req.userRole !== "admin" && req.userId !== comment.user_id) {
            logger.warn("Comment deletion failed: Unauthorized", {
                commentId: req.params.id,
                userId: req.userId,
                userRole: req.userRole,
              });
            return res.status(403).json({ error: "You can only delete your own comments" });
        }

        await comment.destroy();
        logger.info("Comment deleted successfully", {
            commentId: req.params.id,
            userId: req.userId || "unauthenticated",
          });
        res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
        throw error
    }
};

module.exports = {
    getComments,
    getComment,
    createComment,
    updateComment,
    deleteComment,
};
