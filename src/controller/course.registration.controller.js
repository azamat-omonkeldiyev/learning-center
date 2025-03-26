const Enrollment = require("../models/course_register.model");
const EduCenter = require("../models/edu_center.model");
const Branch = require("../models/branch.model");
const enrollmentValidationSchema = require("../validation/coure_registration.validate");
const { Op } = require("sequelize");

const getEnrollments = async (req, res) => {
  try {
      const { page, limit, sortField, sortOrder, edu_id, branch_id } = req.query;

      const queryOptions = {
          include: [
              { model: EduCenter, attributes: ["id", "name"] },
              { model: Branch, attributes: ["id", "name"] },
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

      if (edu_id) {
          queryOptions.where.edu_id = edu_id;
      }
      if (branch_id) {
          queryOptions.where.branch_id = branch_id;
      }

      const enrollments = await Enrollment.findAndCountAll(queryOptions);

      const response = {
          data: enrollments.rows,
          total: enrollments.count,
      };

      if (page && limit) {
          response.page = parseInt(page);
          response.totalPages = Math.ceil(enrollments.count / limit);
      }

      res.json(response);
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
  }
};

const getEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByPk(req.params.id, {
      include: [
        { model: EduCenter, attributes: ["id", "name"] },
        { model: Branch, attributes: ["id", "name"] },
      ],
    });
    if (!enrollment)
      return res.status(404).json({ error: "Enrollment not found" });

    res.json(enrollment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const createEnrollment = async (req, res) => {
  try {
    const { error } = enrollmentValidationSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(400)
        .json({ message: error.details.map((detail) => detail.message) });
    }

    const enrollment = await Enrollment.create(req.body);
    res.status(201).json(enrollment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const updateEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByPk(req.params.id);
    if (!enrollment)
      return res.status(404).json({ error: "Enrollment not found" });

    const { error } = enrollmentValidationSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(400)
        .json({ message: error.details.map((detail) => detail.message) });
    }

    await enrollment.update(req.body);
    res.json(enrollment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByPk(req.params.id);
    if (!enrollment)
      return res.status(404).json({ error: "Enrollment not found" });

    await enrollment.destroy();
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEnrollments,
  getEnrollment,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment,
};
