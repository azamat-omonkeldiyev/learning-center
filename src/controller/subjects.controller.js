const Subjects = require('../models/subject.model');
const EduCenter = require('../models/edu_center.model');
const subjectsValidationSchema = require('../validation/subjects.validate');
const { Op } = require('sequelize');
const logger = require('../config/logger')

const getSubjects = async (req, res) => {
    try {
        logger.info("Fetching subjects", {
            query: req.query,
            userId: req.userId || "unauthenticated",
          });
        const { page = 1, limit = 10, sortField, sortOrder, name } = req.query;

        const queryOptions = {
            include: [
                { model: EduCenter, as: "eduCenters", attributes: ["id", "name"], through: { attributes: [] } },
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

        const subjects = await Subjects.findAndCountAll(queryOptions);

        const response = {
            data: subjects.rows,
            total: subjects.count,
        };

        if (page && limit) {
            response.page = parseInt(page);
            response.totalPages = Math.ceil(subjects.count / limit);
        }
        logger.info("Subjects fetched successfully", {
            total: subjects.count,
            userId: req.userId || "unauthenticated",
          });
        res.json(response);
    } catch (error) {
        throw error
    }
};

const getSubject = async (req, res) => {
    try {
        logger.info("Fetching subject by ID", {
            subjectId: req.params.id,
            userId: req.userId || "unauthenticated",
          });
        const subject = await Subjects.findByPk(req.params.id, {
            include: [
                { model: EduCenter, attributes: ['id', 'name'] }
            ]
        });
        if (!subject) return res.status(404).json({ error: 'Subject not found' });
        logger.info("Subject fetched successfully", {
            subjectId: req.params.id,
            userId: req.userId || "unauthenticated",
          });
        res.json(subject);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
};

const createSubject = async (req, res) => {
    try {
        logger.info("Creating subject", {
            body: req.body,
            userId: req.userId || "unauthenticated",
          });
        const { error } = subjectsValidationSchema.validate(req.body, { abortEarly: false });
        if (error) {
            logger.warn("Subject creation failed: Validation error", {
                error: error.details.map(detail => detail.message),
                userId: req.userId || "unauthenticated",
              });
            return res.status(400).json({ message: error.details.map(detail => detail.message) });
        }

        let SubjectsExists = await Subjects.findOne({where: {name: req.body.name}});
        if(SubjectsExists) return res.status(400).json({message: "subject already created"})

        const subject = await Subjects.create(req.body);
        logger.info("Subject created successfully", {
            subjectId: subject.id,
            name: subject.name,
            userId: req.userId || "unauthenticated",
          });
        res.status(201).json(subject);
    } catch (error) {
        throw error
    }
};

const updateSubject = async (req, res) => {
    try {
        logger.info("Updating subject", {
            subjectId: req.params.id,
            body: req.body,
            userId: req.userId || "unauthenticated",
          });
        const subject = await Subjects.findByPk(req.params.id);
        if (!subject) return res.status(404).json({ error: 'Subject not found' });

        const { error } = subjectsValidationSchema.validate(req.body, { abortEarly: false });
        if (error) {
            logger.warn("Subject update failed: Validation error", {
                error: error.details.map(detail => detail.message),
                userId: req.userId || "unauthenticated",
              });
            return res.status(400).json({ message: error.details.map(detail => detail.message) });
        }

        await subject.update(req.body);
        logger.info("Subject updated successfully", {
            subjectId: req.params.id,
            userId: req.userId || "unauthenticated",
          });
        res.json(subject);
    } catch (error) {
        throw error
    }
};

const deleteSubject = async (req, res) => {
    try {
        logger.info("Deleting subject", {
            subjectId: req.params.id,
            userId: req.userId || "unauthenticated",
          });
        const subject = await Subjects.findByPk(req.params.id);
        if (!subject) return res.status(404).json({ error: 'Subject not found' });

        await subject.destroy();
        logger.info("Subject deleted successfully", {
            subjectId: req.params.id,
            userId: req.userId || "unauthenticated",
          });
        res.status(200).json({ message: 'Deleted successfully' });
    } catch (error) {
        throw error
    }
};

module.exports = {
    getSubjects,
    getSubject,
    createSubject,
    updateSubject,
    deleteSubject
};