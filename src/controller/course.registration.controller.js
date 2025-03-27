const Enrollment = require("../models/course_register.model");
const EduCenter = require("../models/edu_center.model");
const Branch = require("../models/branch.model");
const enrollmentValidationSchema = require("../validation/coure_registration.validate");
const { Op } = require("sequelize");
const logger = require('../config/logger')

const getEnrollments = async (req, res) => {
  try {
    logger.info("Fetching enrollments", {
      query: req.query,
      userId: req.userId || "unauthenticated",
    });
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
      logger.info("Enrollments fetched successfully", {
        total: enrollments.count,
        userId: req.userId || "unauthenticated",
      });
      res.json(response);
  } catch (error) {
    throw error
  }
};

const getEnrollment = async (req, res) => {
  try {
    logger.info("Fetching enrollment by ID", {
      enrollmentId: req.params.id,
      userId: req.userId || "unauthenticated",
    });
    const enrollment = await Enrollment.findByPk(req.params.id, {
      include: [
        { model: EduCenter, attributes: ["id", "name"] },
        { model: Branch, attributes: ["id", "name"] },
      ],
    });
    if (!enrollment)
      return res.status(404).json({ error: "Enrollment not found" });
    logger.info("Enrollment fetched successfully", {
      enrollmentId: req.params.id,
      userId: req.userId || "unauthenticated",
    });
    res.json(enrollment);
  } catch (error) {
    throw error
  }
};

const createEnrollment = async (req, res) => {
  try {
    logger.info("Creating enrollment", {
      body: req.body,
      userId: req.userId || "unauthenticated",
    });
    const { error } = enrollmentValidationSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      logger.warn("Enrollment creation failed: Validation error", {
        error: error.details.map((detail) => detail.message),
        userId: req.userId || "unauthenticated",
      });
      return res
        .status(400)
        .json({ message: error.details.map((detail) => detail.message) });
    }

    const eduAydi = await EduCenter.findByPk(req.body.edu_id)
    if(!eduAydi){
      logger.warn("Enrollment creation failed: Edu center not found", {
        eduId: req.body.edu_id,
        userId: req.userId || "unauthenticated",
      });
      return res.status(404).json({message: "Edu center id not found"})
    }
    const branchAydi = await Branch.findByPk(req.body.branch_id)
    if(!branchAydi){
      logger.warn("Enrollment creation failed: Branch not found", {
        branchId: req.body.branch_id,
        userId: req.userId || "unauthenticated",
      });
      return res.status(404).json({message: "Branch id not found"})
    }

    const enrollment = await Enrollment.create({...req.body, user_id: req.userId});
    logger.info("Enrollment created successfully", {
      enrollmentId: enrollment.id,
      userId: req.userId || "unauthenticated",
    });
    res.status(201).json(enrollment);
  } catch (error) {
    throw error
  }
};

const getMyEnrollments = async (req, res) => {
  try {
    logger.info("Fetching user's enrollments", {
      userId: req.userId || "unauthenticated",
    });
    const user_id = req.userId;

    const enrollments = await Enrollment.findAll({
      where: { user_id },
      include: [
        { model: EduCenter, attributes: ["id", "name"] },
        { model: Branch, attributes: ["id", "name"] },
      ],
    });
    logger.info("User's enrollments fetched successfully", {
      total: enrollments.length,
      userId: req.userId || "unauthenticated",
    });

    res.json({ enrollments });
  } catch (error) {
    throw error
  }
};

const updateEnrollment = async (req, res) => {
  try {
    logger.info("Updating enrollment", {
      enrollmentId: req.params.id,
      body: req.body,
      userId: req.userId || "unauthenticated",
    });
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

    if (req.userRole !== "admin" && req.userId !== enrollment.user_id) {
      return res.status(403).json({ error: "You can only update your own enrollments" });
    }

    await enrollment.update(req.body);
    logger.info("Enrollment updated successfully", {
      enrollmentId: req.params.id,
      userId: req.userId || "unauthenticated",
    });
    res.json(enrollment);
  } catch (error) {
    throw error
  }
};

const deleteEnrollment = async (req, res) => {
  try {
    logger.info("Deleting enrollment", {
      enrollmentId: req.params.id,
      userId: req.userId || "unauthenticated",
    });
    const enrollment = await Enrollment.findByPk(req.params.id);
    if (!enrollment)
      return res.status(404).json({ error: "Enrollment not found" });

    if (req.userRole !== "admin" && req.userId !== enrollment.user_id) {
      logger.warn("Enrollment deletion failed: Unauthorized", {
        enrollmentId: req.params.id,
        userId: req.userId,
        userRole: req.userRole,
      });
      return res.status(403).json({ error: "You can only delete your own enrollments" });
    }

    await enrollment.destroy();
    logger.info("Enrollment deleted successfully", {
      enrollmentId: req.params.id,
      userId: req.userId || "unauthenticated",
    });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    throw error
  }
};

module.exports = {
  getEnrollments,
  getEnrollment,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment,
  getMyEnrollments
};
