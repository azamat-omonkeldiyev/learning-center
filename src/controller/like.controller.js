const Like = require("../models/like.model");
const { Op } = require("sequelize");

const createLike = async (req, res) => {
    try {
        const { edu_id, branch_id } = req.body;
        const user_id = req.userId;

        if ((!edu_id && !branch_id) || (edu_id && branch_id)) {
            return res.status(400).json({ message: "Only one of edu_id or branch_id must be provided!" });
        };
        if (edu_id) {
            const eduExists = await EduCenter.findByPk(edu_id);
            if (!eduExists) return res.status(404).json({ message: "Educational Center not found." });
        }
        if (branch_id) {
            const branchExists = await Branch.findByPk(branch_id);
            if (!branchExists) return res.status(404).json({ message: "Branch not found." });
        }

        const existingLike = await Like.findOne({
            where: {
                user_id,
                edu_id: edu_id || null,
                branch_id: branch_id || null,
            },
        });

        if (existingLike) {
            return res.status(400).json({ message: "You have already liked this!" });
        }

        const newLike = await Like.create({ user_id, edu_id, branch_id });
        res.status(201).json({ like: newLike });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const deleteLike = async (req, res) => {
    try {
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
        res.status(200).json({ message: "Like deleted successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {createLike, deleteLike}
