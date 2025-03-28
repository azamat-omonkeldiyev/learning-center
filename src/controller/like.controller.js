const Branch = require("../models/branch.model");
const EduCenter = require("../models/edu_center.model");
const Like = require("../models/like.model");
const { Op } = require("sequelize");
const logger = require('../config/logger')

const createLike = async (req, res) => {
    try {
        logger.info("Creating like", {
            body: req.body,
            userId: req.userId || "unauthenticated",
          });
        const { edu_id} = req.body;
        const user_id = req.userId;

        if ((!edu_id)) {
            return res.status(400).json({ message: "edu_id  must be provided!" });
        };
        if (edu_id) {
            const eduExists = await EduCenter.findByPk(edu_id);
            if (!eduExists) return res.status(404).json({ message: "Educational Center not found." });
        }

        const existingLike = await Like.findOne({
            where: {
                user_id,
                edu_id: edu_id || null,
            },
        });

        if (existingLike) {
            return res.status(400).json({ message: "You have already liked this!" });
        }

        const newLike = await Like.create({ user_id, edu_id });
        logger.info("Like created successfully", {
            likeId: newLike.id,
            userId: user_id,
            eduId: edu_id,
          });
        res.status(201).json({ like: newLike });
    } catch (error) {
        throw error
    }
};

const deleteLike = async (req, res) => {
    try {
        logger.info("Deleting like", {
            likeId: req.params.id,
            userId: req.userId || "unauthenticated",
          });
        const like_id = req.params.id;
        const user_id = req.userId;
        const user_role = req.userRole;

        const like = await Like.findByPk(like_id);
        if (!like) {
            return res.status(404).json({ message: "Like not found!" });
        }

        if (user_role !== "admin" && like.user_id !== user_id) {
            return res.status(403).json({ message: "You are not authorized to delete this like!" });
        }

        await like.destroy();
        logger.info("Like deleted successfully", {
            likeId: like_id,
            userId: req.userId || "unauthenticated",
          });
        res.status(200).json({ message: "Like deleted successfully!" });
    } catch (error) {
        throw error
    }
};

module.exports = {createLike, deleteLike}
