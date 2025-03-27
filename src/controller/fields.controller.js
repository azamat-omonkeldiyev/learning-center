const Fields = require("../models/fields.model");
const EduCenter = require("../models/edu_center.model");
const fieldsValidationSchema = require("../validation/fields.validate");
const { Op } = require("sequelize");

const getFields = async (req, res) => {
  try {
      const { page = 1, limit = 10, sortField, sortOrder, name } = req.query;

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

      res.json(response);
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
  }
};

const getField = async (req, res) => {
  try {
    const field = await Fields.findByPk(req.params.id, {
      include: [{ model: EduCenter, attributes: ["id", "name"] }],
    });
    if (!field) return res.status(404).json({ error: "Field not found" });

    res.json(field);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const createField = async (req, res) => {
  try {
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
    res.status(201).json(field);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const updateField = async (req, res) => {
  try {
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
    res.json(field);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteField = async (req, res) => {
  try {
    const field = await Fields.findByPk(req.params.id);
    if (!field) return res.status(404).json({ error: "Field not found" });

    await field.destroy();
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getFields,
  getField,
  createField,
  updateField,
  deleteField,
};
