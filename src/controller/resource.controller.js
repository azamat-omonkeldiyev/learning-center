const Resource = require("../models/resources.model");
const User = require("../models/user.model");
const resCategory = require("../models/res-category.model");

const resourceValidationSchema = require("../validation/resource.validate");
const { Op } = require("sequelize");

const getResources = async (req, res) => {
  try {
    const { page, limit, sort, name, category_id, user_id } = req.query;

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

    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getResource = async (req, res) => {
  try {
    const resource = await Resource.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ["id", "fullname"] },
        { model: resCategory, attributes: ["id", "name"] },
      ],
    });
    if (!resource) return res.status(404).json({ error: "Resource not found" });

    res.json(resource);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const createResource = async (req, res) => {
  try {
    const { error } = resourceValidationSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(400)
        .json({ message: error.details.map((detail) => detail.message) });
    }

    const resource = await Resource.create({...req.body,user_id: req.userId});
    res.status(201).json(resource);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const updateResource = async (req, res) => {
  try {
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
    res.json({ message: "Resource updated successfully", resource });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findByPk(req.params.id);
    if (!resource) return res.status(404).json({ error: "Resource not found" });

    // ✅ Admin bo‘lmasa, faqat o‘z resursini o‘chira oladi
    if (req.userRole !== "admin" && resource.user_id !== req.userId) {
      return res.status(403).json({ error: "You can only delete your own resources" });
    }

    await resource.destroy();
    res.status(200).json({ message: "Resource deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getResources,
  getResource,
  createResource,
  updateResource,
  deleteResource,
};
