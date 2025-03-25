const resCategory = require('../models/res-category.model')
const Resource = require('../models/resources.model')

const ResCategoryValidationSchema = require("../validation/res-category.validate");
const { Op } = require("sequelize");

const getResCategories = async (req, res) => {
    try {
        const { page, limit, sort, name } = req.query;

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

        if (sort) {
            const [sortField, sortOrder] = sort.split(":");
            queryOptions.order.push([
                sortField || "createdAt",
                sortOrder && sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC",
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

        res.json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const getResCategory = async (req, res) => {
    try {
        const category = await resCategory.findByPk(req.params.id, {
            include: [
                { model: Resource, attributes: ["id", "name"] }
            ],
        });
        if (!category) return res.status(404).json({ error: "Resource category not found" });

        res.json(category);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const createResCategory = async (req, res) => {
    try {
        const { error } = ResCategoryValidationSchema.validate(req.body, {
            abortEarly: false,
        });
        if (error) {
            return res
                .status(400)
                .json({ message: error.details.map((detail) => detail.message) });
        }

        const category = await resCategory.create(req.body);
        res.status(201).json(category);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const updateResCategory = async (req, res) => {
    try {
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
        res.json(category);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const deleteResCategory = async (req, res) => {
    try {
        const category = await resCategory.findByPk(req.params.id);
        if (!category) return res.status(404).json({ error: "Resource category not found" });

        await category.destroy();
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