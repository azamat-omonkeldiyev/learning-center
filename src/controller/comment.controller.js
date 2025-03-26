const Comment = require("../models/comment.model");
const User = require("../models/user.model");
const EduCenter = require("../models/edu_center.model");
const Branch = require("../models/branch.model");

const CommentValidationSchema = require("../validation/comment.validate");
const { Op } = require("sequelize");

// ✅ GET: All Comments (Filtered)
const getComments = async (req, res) => {
    try {
<<<<<<< HEAD
        const { page, limit, sortField, sortOrder, text, star, edu_id, user_id } = req.query;
=======
        const { page, limit, sort, text, star, edu_id, branch_id, user_id } = req.query;
>>>>>>> 0bf504b8e0af465783a396931ee4209b0a32cc3c

        const queryOptions = {
            include: [
                { model: User, attributes: ["id", "name"] },
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

        res.json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

// ✅ GET: Single Comment
const getComment = async (req, res) => {
    try {
        const comment = await Comment.findByPk(req.params.id, {
            include: [
                { model: User, attributes: ["id", "name"] },
                { model: EduCenter, attributes: ["id", "name"] },
                { model: Branch, attributes: ["id", "name"] }
            ],
        });
        if (!comment) return res.status(404).json({ error: "Comment not found" });

        res.json(comment);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

// ✅ POST: Create Comment
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

        const comment = await Comment.create({...req.body,user_id:req.userId});
        res.status(201).json(comment);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

// ✅ PUT: Update Comment (Only Owner or CEO)
const updateComment = async (req, res) => {
    try {
        const comment = await Comment.findByPk(req.params.id);
        if (!comment) return res.status(404).json({ error: "Comment not found" });

        if (req.userRole !== "admin" || req.userRole !== "superadmin" && req.userId !== comment.user_id) {
            return res.status(403).json({ error: "You can only update your own comments" });
        }

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

// ✅ DELETE: Delete Comment (Only Owner or CEO)
const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findByPk(req.params.id);
        if (!comment) return res.status(404).json({ error: "Comment not found" });

        if (req.userRole !== "admin" && req.userId !== comment.user_id) {
            return res.status(403).json({ error: "You can only delete your own comments" });
        }

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
