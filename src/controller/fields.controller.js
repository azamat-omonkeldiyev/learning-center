const Fields = require("../models/fields.model");
const EduCenter = require("../models/edu_center.model");
const fieldsValidationSchema = require("../validation/fields.validate");
const { Op } = require("sequelize");
const logger = require('../config/logger')

const getFields = async (req, res) => {
  try {
    logger.info("Fetching fields", {
      query: req.query,
      userId: req.userId || "unauthenticated",
    });
      const { page, limit, sortField, sortOrder, name } = req.query;

    const queryOptions = {
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

      const fields = await Fields.findAndCountAll(queryOptions);

      const response = {
          data: fields.rows,
          total: fields.count,
      };

      if (page && limit) {
          response.page = parseInt(page);
          response.totalPages = Math.ceil(fields.count / limit);
      }
      logger.info("Fields fetched successfully", {
        total: fields.count,
        userId: req.userId || "unauthenticated",
      });
      res.json(response);
  } catch (error) {
    throw error
  }
};

const getField = async (req, res) => {
  try {
    logger.info("Fetching field by ID", {
      fieldId: req.params.id,
      userId: req.userId || "unauthenticated",
    });
    const field = await Fields.findByPk(req.params.id, {
      include: [{ model: EduCenter, attributes: ["id", "name"] }],
    });
    if (!field) return res.status(404).json({ error: "Field not found" });
    logger.info("Field fetched successfully", {
      fieldId: req.params.id,
      userId: req.userId || "unauthenticated",
    });
    res.json(field);
  } catch (error) {
    throw error
  }
};

const createField = async (req, res) => {
  try {
    logger.info("Creating field", {
      body: req.body,
      userId: req.userId || "unauthenticated",
    });
    const { error } = fieldsValidationSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(400)
        .json({ message: error.details.map((detail) => detail.message) });
    }

    let fieldExists = await Fields.findOne({where: {name: req.body.name}});
    if(fieldExists) return res.status(400).json({message: "field already created"})

    const field = await Fields.create(req.body);
    logger.info("Field created successfully", {
      fieldId: field.id,
      name: field.name,
      userId: req.userId || "unauthenticated",
    });
    res.status(201).json(field);
  } catch (error) {
    throw error
  }
};

const updateField = async (req, res) => {
  try {
    logger.info("Updating field", {
      fieldId: req.params.id,
      body: req.body,
      userId: req.userId || "unauthenticated",
    });
    const field = await Fields.findByPk(req.params.id);
    if (!field) return res.status(404).json({ error: "Field not found" });

    const { error } = fieldsValidationSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(400)
        .json({ message: error.details.map((detail) => detail.message) });
    }

    await field.update(req.body);
    logger.info("Field updated successfully", {
      fieldId: req.params.id,
      userId: req.userId || "unauthenticated",
    });
    res.json(field);
  } catch (error) {
    throw error
  }
};

const deleteField = async (req, res) => {
  try {
    logger.info("Deleting field", {
      fieldId: req.params.id,
      userId: req.userId || "unauthenticated",
    });
    const field = await Fields.findByPk(req.params.id);
    if (!field) return res.status(404).json({ error: "Field not found" });

    await field.destroy();
    logger.info("Field deleted successfully", {
      fieldId: req.params.id,
      userId: req.userId || "unauthenticated",
    });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    throw error
  }
};

module.exports = {
  getFields,
  getField,
  createField,
  updateField,
  deleteField,
};
