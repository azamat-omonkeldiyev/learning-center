const EduCenter = require("../models/edu_center.model");
const Branch = require("../models/branch.model");
const Subjects = require("../models/subject.model");
const Fields = require("../models/fields.model");
const Comment = require('../models/comment.model')
const educenterValidationSchema = require("../validation/edu_center_validate");
const { Op } = require("sequelize");

const getEduCenters = async (req, res) => {
  try {
      const { page, limit, sortField, sortOrder, name } = req.query;

      const queryOptions = {
          include: [
              { model: Branch, attributes: ["id", "name"] },
              { model: Subjects, as: "subjects", attributes: ["id", "name"], through: { attributes: [] } },
              { model: Fields, as: "fields", attributes: ["id", "name"], through: { attributes: [] } },
              { model: Comment, attributes: ["id", "text", "star"] },
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

      const eduCenters = await EduCenter.findAndCountAll(queryOptions);

      const response = {
          data: eduCenters.rows,
          total: eduCenters.count,
      };

      if (page && limit) {
          response.page = parseInt(page);
          response.totalPages = Math.ceil(eduCenters.count / limit);
      }

      res.json(response);
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
  }
};

const getEduCenter = async (req, res) => {
  try {
    const educenter = await EduCenter.findByPk(req.params.id, {
      include: [
        { model: Branch, attributes: ["id", "name"] },
        { model: Subjects, attributes: ["id", "name"] },
        { model: Fields, attributes: ["id", "name"] },
      ],
    });
    if (!educenter)
      return res.status(404).json({ error: "EduCenter not found" });

    res.json(educenter);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const createEduCenter = async (req, res) => {
  try {
    const { error } = educenterValidationSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(400)
        .json({ message: error.details.map((detail) => detail.message) });
    }

    const educenter = await EduCenter.create(req.body);
    res.status(201).json(educenter);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const updateEduCenter = async (req, res) => {
  try {
    const educenter = await EduCenter.findByPk(req.params.id);
    if (!educenter)
      return res.status(404).json({ error: "EduCenter not found" });

    const { error } = educenterValidationSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(400)
        .json({ message: error.details.map((detail) => detail.message) });
    }

    await educenter.update(req.body);
    res.json(educenter);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteEduCenter = async (req, res) => {
  try {
    const educenter = await EduCenter.findByPk(req.params.id);
    if (!educenter)
      return res.status(404).json({ error: "EduCenter not found" });

    await educenter.destroy();
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEduCenters,
  getEduCenter,
  createEduCenter,
  updateEduCenter,
  deleteEduCenter,
};
