const Resource = require("../models/resources.model");
const User = require("../models/user.model");
const resCategory = require("../models/res-category.model");
const logger = require('../config/logger')
const resourceValidationSchema = require("../validation/resource.validate");
const { Op } = require("sequelize");

const getResources = async (req, res) => {
  try {
    logger.info("Fetching resources", {
      query: req.query,
      userId: req.userId || "unauthenticated",
    });
      const { page, limit, sortField, sortOrder, name, category_id, user_id } = req.query;

    const queryOptions = {
      include: [
        { model: User, attributes: ["id", "fullname"] },
        { model: resCategory, attributes: ["id", "name"] },
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
      if (category_id) {
          queryOptions.where.category_id = category_id;
      }
      if (user_id) {
          queryOptions.where.user_id = user_id;
      }

      const resources = await Resource.findAndCountAll(queryOptions);

      const response = {
          data: resources.rows,
          total: resources.count,
      };

      if (page && limit) {
          response.page = parseInt(page);
          response.totalPages = Math.ceil(resources.count / limit);
      }
      logger.info("Resources fetched successfully", {
        total: resources.count,
        userId: req.userId || "unauthenticated",
      });
      res.json(response);
  } catch (error) {
    throw error
  }
};

const getResource = async (req, res) => {
  try {
    logger.info("Fetching resource by ID", {
      resourceId: req.params.id,
      userId: req.userId || "unauthenticated",
    });
    const resource = await Resource.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ["id", "fullname"] },
        { model: resCategory, attributes: ["id", "name"] },
      ],
    });
    if (!resource) return res.status(404).json({ error: "Resource not found" });
    logger.info("Resource fetched successfully", {
      resourceId: req.params.id,
      userId: req.userId || "unauthenticated",
    });
    res.json(resource);
  } catch (error) {
    throw error
  }
};

const createResource = async (req, res) => {
  try {
    logger.info("Creating resource", {
      body: req.body,
      userId: req.userId || "unauthenticated",
    });
    const { error } = resourceValidationSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(400)
        .json({ message: error.details.map((detail) => detail.message) });
    }
    const categoryId = await resCategory.findByPk(req.body.category_id)
    if(!categoryId){
      return res.status(404).json({message: "Category not found"})
    }

    const resource = await Resource.create({...req.body,user_id: req.userId});
    logger.info("Resource created successfully", {
      resourceId: resource.id,
      userId: req.userId || "unauthenticated",
    });
    res.status(201).json(resource);
  } catch (error) {
    throw error
  }
};

const updateResource = async (req, res) => {
  try {
    logger.info("Updating resource", {
      resourceId: req.params.id,
      body: req.body,
      userId: req.userId || "unauthenticated",
    });
    const resource = await Resource.findByPk(req.params.id);
    if (!resource) return res.status(404).json({ error: "Resource not found" });

    // ✅ Admin bo‘lmasa, faqat o‘z resursini o‘zgartira oladi
    if (req.userRole !== "admin" && resource.user_id !== req.userId) {
      return res.status(403).json({ error: "You can only update your own resources" });
    }

    const { error } = resourceValidationSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ message: error.details.map((detail) => detail.message) });
    }

    await resource.update(req.body);
    logger.info("Resource updated successfully", {
      resourceId: req.params.id,
      userId: req.userId || "unauthenticated",
    });
    res.json({ message: "Resource updated successfully", resource });
  } catch (error) {
    throw error
  }
};

const deleteResource = async (req, res) => {
  try {
    logger.info("Deleting resource", {
      resourceId: req.params.id,
      userId: req.userId || "unauthenticated",
    });
    const resource = await Resource.findByPk(req.params.id);
    if (!resource) return res.status(404).json({ error: "Resource not found" });

    // ✅ Admin bo‘lmasa, faqat o‘z resursini o‘chira oladi
    if (req.userRole !== "admin" && resource.user_id !== req.userId) {
      return res.status(403).json({ error: "You can only delete your own resources" });
    }

    await resource.destroy();
    logger.info("Resource deleted successfully", {
      resourceId: req.params.id,
      userId: req.userId || "unauthenticated",
    });
    res.status(200).json({ message: "Resource deleted successfully" });
  } catch (error) {
    throw error
  }
};


module.exports = {
  getResources,
  getResource,
  createResource,
  updateResource,
  deleteResource,
};
