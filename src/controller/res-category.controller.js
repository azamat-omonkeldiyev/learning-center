const resCategory = require('../models/res-category.model')
const Resource = require('../models/resources.model')
const logger = require('../config/logger')
const ResCategoryValidationSchema = require("../validation/res-category.validate");
const { Op } = require("sequelize");

const getResCategories = async (req, res) => {
    try {
        logger.info("Fetching resource categories", {
            query: req.query,
            userId: req.userId || "unauthenticated",
          });
        const { page = 1, limit = 10, sortField, sortOrder, name } = req.query;

        const queryOptions = {
            include: [
                { model: Resource, attributes: ["id", "name"] }
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

        if (name) {
            queryOptions.where.name = { [Op.like]: `%${name}%` };
        }

        const resCategories = await resCategory.findAndCountAll(queryOptions);

        const response = {
            data: resCategories.rows,
            total: resCategories.count,
        };

        if (page && limit) {
            response.page = parseInt(page);
            response.totalPages = Math.ceil(resCategories.count / limit);
        }
        logger.info("Resource categories fetched successfully", {
            total: resCategories.count,
            userId: req.userId || "unauthenticated",
          });
        res.json(response);
    } catch (error) {
        throw error
    }
};

const getResCategory = async (req, res) => {
    try {
        logger.info("Fetching resource category by ID", {
            categoryId: req.params.id,
            userId: req.userId || "unauthenticated",
          });
        const category = await resCategory.findByPk(req.params.id, {
            include: [
                { model: Resource, attributes: ["id", "name"] }
            ],
        });
        if (!category) return res.status(404).json({ error: "Resource category not found" });
        logger.info("Resource category fetched successfully", {
            categoryId: req.params.id,
            userId: req.userId || "unauthenticated",
          });
        res.json(category);
    } catch (error) {
        throw error
    }
};

const createResCategory = async (req, res) => {
    try {
        logger.info("Creating resource category", {
            body: req.body,
            userId: req.userId || "unauthenticated",
          });
        const { error } = ResCategoryValidationSchema.validate(req.body, {
            abortEarly: false,
        });
        if (error) {
            return res
                .status(400)
                .json({ message: error.details.map((detail) => detail.message) });
        }

        let categoryExists = await resCategory.findOne({where: {name: req.body.name}});
        if(categoryExists) return res.status(400).json({message: "resCategory already created"})

        const category = await resCategory.create(req.body);
        logger.info("Resource category created successfully", {
            categoryId: category.id,
            name: category.name,
            userId: req.userId || "unauthenticated",
          });
        res.status(201).json(category);
    } catch (error) {
        throw error
    }
};

const updateResCategory = async (req, res) => {
    try {
        logger.info("Updating resource category", {
            categoryId: req.params.id,
            body: req.body,
            userId: req.userId || "unauthenticated",
          });
        const category = await resCategory.findByPk(req.params.id);
        if (!category) return res.status(404).json({ error: "Resource category not found" });

        const { error } = ResCategoryValidationSchema.validate(req.body, {
            abortEarly: false,
        });
        if (error) {
            return res
                .status(400)
                .json({ message: error.details.map((detail) => detail.message) });
        }

        await category.update(req.body);
        logger.info("Resource category updated successfully", {
            categoryId: req.params.id,
            userId: req.userId || "unauthenticated",
          });
        res.json(category);
    } catch (error) {
        throw error
    }
};

const deleteResCategory = async (req, res) => {
    try {
        logger.info("Deleting resource category", {
            categoryId: req.params.id,
            userId: req.userId || "unauthenticated",
          });
        const category = await resCategory.findByPk(req.params.id);
        if (!category) return res.status(404).json({ error: "Resource category not found" });

        await category.destroy();
        logger.info("Resource category deleted successfully", {
            categoryId: req.params.id,
            userId: req.userId || "unauthenticated",
          });
        res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getResCategories,
    getResCategory,
    createResCategory,
    updateResCategory,
    deleteResCategory,
};