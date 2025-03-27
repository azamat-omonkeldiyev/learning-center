const EduCenter = require("../models/edu_center.model");
const Branch = require("../models/branch.model");
const Subjects = require("../models/subject.model");
const Fields = require("../models/fields.model");
const FieldsOfEdu = require("../models/edu_center_fields.model");
const SubjectsOfEdu = require("../models/edu_center_subjects.model");
const Comment = require("../models/comment.model");
const educenterValidationSchema = require("../validation/edu_center_validate");
const { Op } = require("sequelize");
const User = require("../models/user.model");
const Region = require("../models/region.model");
const Like = require("../models/like.model");
const logger = require('../config/logger')

const getEduCenters = async (req, res) => {
  try {
    logger.info("Fetching education centers", {
      query: req.query,
      userId: req.userId || "unauthenticated",
    });
    const { page = 1, limit = 10, sortField = "createdAt", sortOrder = "ASC", name, region_id, subject_id, field_id } = req.query;

    const whereClause = {};
    if (name) whereClause.name = { [Op.like]: `%${name}%` };
    if (region_id) whereClause.region_id = region_id;

    const includeOptions = [
      { model: Branch, attributes: ["id", "name"], as: "branches" },
      { model: Subjects, attributes: ["id", "name"], as: "subjects", through: { attributes: [] } },
      { model: Fields, attributes: ["id", "name"], as: "fields", through: { attributes: [] } },
      { 
        model: Comment, 
        attributes: ["id", "text", "star", "user_id"], 
        as: "comments",
        // include: [{ model: User, attributes: ["id", "fullname"], as: "user" }]
      },
      { model: Region, attributes: ["name"] }
    ];

    if (subject_id) {
      includeOptions.push({
        model: Subjects,
        as: "subjects",
        where: { id: subject_id },
        attributes: ["id", "name"],
        through: { attributes: [] }
      });
    }

    if (field_id) {
      includeOptions.push({
        model: Fields,
        as: "fields",
        where: { id: field_id },
        attributes: ["id", "name"],
        through: { attributes: [] }
      });
    }

    const total = await EduCenter.count({
      where: whereClause,
      include: includeOptions,
      distinct: true,
    });

    const queryOptions = {
      include: includeOptions,
      where: whereClause,
      order: [[sortField, sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC"]],
      distinct: true,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    };

    let educentersData = await EduCenter.findAll(queryOptions);

    // let emas, const ishlatilgan, o'zgaruvchiga qayta qiymat berish yo'q
    const educenters = await Promise.all(educentersData.map(async (edu) => {
      const branchCount = await Branch.count({ where: { edu_id: edu.id } });
      const likeCount = await Like.count({ where: { edu_id: edu.id } });
      const comments = edu.comments || [];
      const averageStar = comments.length > 0
        ? (comments.reduce((sum, comment) => sum + comment.star, 0) / comments.length).toFixed(1)
        : 0;
      return { ...edu.toJSON(), branchCount, likeCount, averageStar };
    }));
    logger.info("Education centers fetched successfully", {
      total,
      userId: req.userId || "unauthenticated",
    });
    res.json({
      data: educenters,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });

  } catch (error) {
    throw error
  }
};

const getEduCenter = async (req, res) => {
  try {
    logger.info("Fetching education center by ID", {
      eduCenterId: req.params.id,
      userId: req.userId || "unauthenticated",
    });
    const educenter = await EduCenter.findByPk(req.params.id, {
      include: [
        { model: Branch, as: "branches",
          include : [
            { model: Subjects, as: "subjects2", attributes: ["id", "name"],through: { attributes: [] } },
            { model: Fields, attributes: ["id", "name"], as: "fields2", through: { attributes: [] } },
          ]
         },
        { model: Subjects, as: "subjects", attributes: ["id", "name"],through: { attributes: [] } },
        { model: Fields, attributes: ["id", "name"], as: "fields", through: { attributes: [] } },
        { 
          model: Comment, 
          attributes: ["id", "text", "star", "user_id"], 
          as: "comments",
          include: [{ model: User, attributes: ["id", "fullname"], as: "user" }]
        },
        { model: Region, attributes: ["name"] }
      ],
    });
    if (!educenter) {
      return res.status(404).json({ error: "EduCenter not found" });
    }

    const branchCount = await Branch.count({ where: { edu_id: educenter.id } });
    const likeCount = await Like.count({ where: { edu_id: educenter.id } });
    const comments = educenter.comments || [];
    const averageStar = comments.length > 0
      ? (comments.reduce((sum, comment) => sum + comment.star, 0) / comments.length).toFixed(1)
      : 0;
      logger.info("Education center fetched successfully", {
        eduCenterId: req.params.id,
        userId: req.userId || "unauthenticated",
      });
    res.json({ ...educenter.toJSON(), branchCount, likeCount, averageStar });
  } catch (error) {
    throw error
  }
};

const createEduCenter = async (req, res) => {
  try {
    logger.info("Creating education center", {
      body: req.body,
      userId: req.userId || "unauthenticated",
    });
    const { subjects, fields,branchCount,region_id, ...rest } = req.body;
    console.log(req.body);
    const user_id = req.userId;
    console.log(rest);

    const { error } = educenterValidationSchema.validate(rest, { abortEarly: false });
    if (error) {
      return res.status(400).json({ message: error.details.map((detail) => detail.message) });
    }

    let regionExists = await Region.findByPk(region_id);
    if(!regionExists) return res.status(404).json({message: "region id not found"});

    const existingEdu = await EduCenter.findOne({ where: { name: rest.name } });
    if (existingEdu) {
      return res.status(400).json({ message: "This education center name already exists" });
    }
    const existingPhone = await EduCenter.findOne({ where: { phone: rest.phone } });
    if (existingPhone) {
      return res.status(400).json({ message: "This phone number is already in use" });
    }

    if (subjects && subjects.length > 0) {
      const validSubjects = await Subjects.findAll({ where: { id: subjects } });
      const validSubjectIds = validSubjects.map((s) => s.id);

      const invalidSubjects = subjects.filter((id) => !validSubjectIds.includes(id));
      if (invalidSubjects.length > 0) {
        return res.status(400).json({ message: `Invalid subject IDs: ${invalidSubjects.join(", ")}` });
      }
    }

    if (fields && fields.length > 0) {
      const validFields = await Fields.findAll({ where: { id: fields } });
      const validFieldIds = validFields.map((f) => f.id);

      const invalidFields = fields.filter((id) => !validFieldIds.includes(id));
      if (invalidFields.length > 0) {
        return res.status(400).json({ message: `Invalid field IDs: ${invalidFields.join(", ")}` });
      }
    }

    const educenter = await EduCenter.create({ region_id, ...rest, branchCount: 0, CEO_id:user_id});

    let subjects_educenter;
    if (subjects && subjects.length > 0) {
      subjects_educenter = subjects.map((id) => ({
        edu_id: educenter.id,
        subject_id: id,
      }));
      await SubjectsOfEdu.bulkCreate(subjects_educenter);
    }

    let fields_educenter;
    if (fields && fields.length > 0) {
      fields_educenter = fields.map((id) => ({
        edu_id: educenter.id,
        field_id: id,
      }));
      await FieldsOfEdu.bulkCreate(fields_educenter);
    }
    logger.info("Education center created successfully", {
      eduCenterId: educenter.id,
      name: educenter.name,
      userId: req.userId || "unauthenticated",
    });
    res.status(201).json({ 
      educenter,
      subjects: subjects_educenter,
      fields: fields_educenter, 
     });

  } catch (error) {
    throw error
  }
};


const updateEduCenter = async (req, res) => {
  try {
    logger.info("Updating education center", {
      eduCenterId: req.params.id,
      body: req.body,
      userId: req.userId || "unauthenticated",
    });
    const { error } = educenterValidationSchema.fork(Object.keys(req.body), (schema) =>
      schema.required()
    ).validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({ message: error.details.map((detail) => detail.message) });
    }

    const educenter = await EduCenter.findByPk(req.params.id);
    if (!educenter) {
      return res.status(404).json({ error: "EduCenter not found" });
    }

    if (req.body.name) {
      const existingEdu = await EduCenter.findOne({
        where: { name: req.body.name, id: { [Op.ne]: educenter.id } },
      });
      if (existingEdu) {
        return res.status(400).json({ message: "This education center name already exists" });
      }
    }

    if (req.body.phone) {
      const existingPhone = await EduCenter.findOne({
        where: { phone: req.body.phone, id: { [Op.ne]: educenter.id } },
      });
      if (existingPhone) {
        return res.status(400).json({ message: "This phone number is already in use" });
      }
    }

    // **Subjects yangilash**
    if (req.body.subjects) {
      await SubjectsOfEdu.destroy({ where: { edu_id: educenter.id } });
      const subjectLinks = req.body.subjects.map((id) => ({ edu_id: educenter.id, subject_id: id }));
      await SubjectsOfEdu.bulkCreate(subjectLinks);
    }

    // **Fields yangilash**
    if (req.body.fields) {
      await FieldsOfEdu.destroy({ where: { edu_id: educenter.id } });
      const fieldLinks = req.body.fields.map((id) => ({ edu_id: educenter.id, field_id: id }));
      await FieldsOfEdu.bulkCreate(fieldLinks);
    }

    // **Faqat yuborilgan maydonlarni yangilash**
    await educenter.update(req.body, { fields: Object.keys(req.body) });
    logger.info("Education center updated successfully", {
      eduCenterId: req.params.id,
      userId: req.userId || "unauthenticated",
    });
    res.status(200).json({ message: "EduCenter updated successfully", educenter });

  } catch (error) {
    throw error
  }
};

const deleteEduCenter = async (req, res) => {
  try {
    logger.info("Deleting education center", {
      eduCenterId: req.params.id,
      userId: req.userId || "unauthenticated",
    });
    const educenter = await EduCenter.findByPk(req.params.id);
    if (!educenter) {
      logger.warn("Education center deletion failed: EduCenter not found", {
        eduCenterId: req.params.id,
        userId: req.userId || "unauthenticated",
      });
      return res.status(404).json({ error: "EduCenter not found" });
    }

    // **Bog‘liq ma’lumotlarni o‘chirish**
    await SubjectsOfEdu.destroy({ where: { edu_id: educenter.id } });
    await FieldsOfEdu.destroy({ where: { edu_id: educenter.id } });
    await Comment.destroy({ where: { edu_id: educenter.id } });

    // **Asosiy ta’lim markazini o‘chirish**
    await educenter.destroy();
    logger.info("Education center deleted successfully", {
      eduCenterId: req.params.id,
      userId: req.userId || "unauthenticated",
    });
    res.status(200).json({ message: "EduCenter deleted successfully" });

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
  deleteEduCenter
};
