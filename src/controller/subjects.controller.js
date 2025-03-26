const Subjects = require('../models/subject.model');
const EduCenter = require('../models/edu_center.model');
const subjectsValidationSchema = require('../validation/subjects.validate');
const { Op } = require('sequelize');

const getSubjects = async (req, res) => {
    try {
        const { page, limit, sortField, sortOrder, name } = req.query;

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

        res.json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const getSubject = async (req, res) => {
    try {
        const subject = await Subjects.findByPk(req.params.id, {
            include: [
                { model: EduCenter, attributes: ['id', 'name'] }
            ]
        });
        if (!subject) return res.status(404).json({ error: 'Subject not found' });

        res.json(subject);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
};

const createSubject = async (req, res) => {
    try {
        const { error } = subjectsValidationSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({ message: error.details.map(detail => detail.message) });
        }

        let SubjectsExists = await Subjects.findOne({where: {name: req.body.name}});
        if(SubjectsExists) return res.status(400).json({message: "subject already created"})

        const subject = await Subjects.create(req.body);
        res.status(201).json(subject);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
};

const updateSubject = async (req, res) => {
    try {
        const subject = await Subjects.findByPk(req.params.id);
        if (!subject) return res.status(404).json({ error: 'Subject not found' });

        const { error } = subjectsValidationSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({ message: error.details.map(detail => detail.message) });
        }

        await subject.update(req.body);
        res.json(subject);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
};

const deleteSubject = async (req, res) => {
    try {
        const subject = await Subjects.findByPk(req.params.id);
        if (!subject) return res.status(404).json({ error: 'Subject not found' });

        await subject.destroy();
        res.status(200).json({ message: 'Deleted successfully' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getSubjects,
    getSubject,
    createSubject,
    updateSubject,
    deleteSubject
};