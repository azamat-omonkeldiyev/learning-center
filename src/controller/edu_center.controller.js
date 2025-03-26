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

const getEduCenters = async (req, res) => {
  try {
    const { page, limit, sort, name, region_id, subject_id, field_id } = req.query;

    const whereClause = {};
    if (name) {
      whereClause.name = { [Op.like]: `%${name}%` };
    }
    if (region_id) {
      whereClause.region_id = region_id;
    }

    const includeOptions = [
      { model: Branch, attributes: ["id", "name"], as: "branches" },
      { model: Subjects, attributes: ["id", "name"], as: "subjects" },
      { model: Fields, attributes: ["id", "name"], as: "fields", through: { attributes: [] } },
      { 
        model: Comment, 
        attributes: ["id", "text", "star", "user_id"], 
        as: "comments",
        include: [{ model: User, attributes: ["id", "fullname"], as: "user" }]
      },
      {model: Region, attributes: ["name"]}
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
      order: [],
      distinct: true,
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

    const educenters = await EduCenter.findAll(queryOptions);

    educenters = await Promise.all(educenters.map(async (edu) => {
      const branchCount = await Branch.count({ where: { edu_center_id: edu.id } });
      const likeCount = await Like.count({ where: { edu_id: edu.id } });
      return { ...edu.toJSON(), branchCount,likeCount }; 
    }));

    const response = {
      data: educenters,
      total, 
    };

    if (page && limit) {
      response.page = parseInt(page);
      response.totalPages = Math.ceil(total / limit);
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
        { model: Branch,as: "branches", attributes: ["id", "name"] },
        { model: Subjects, as: "subjects", attributes: ["id", "name"] },
        { model: Fields, attributes: ["id", "name"], as: "fields",through: { attributes: [] } },
        { 
          model: Comment, 
          attributes: ["id", "text", "star", "user_id"], 
          as: "comments",
          include: [{ model: User, attributes: ["id", "fullname"], as: "user" }]
        },
        {model: Region, attributes: ["name"]}
      ],
    });
    if (!educenter)
      return res.status(404).json({ error: "EduCenter not found" });

    const branchCount = await Branch.count({ where: { edu_center_id: educenter.id } });
    const likeCount = await Like.count({ where: { edu_id: educenter.id } });

    res.json({ ...educenter.toJSON(), branchCount, likeCount });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const createEduCenter = async (req, res) => {
  try {
    const { subjects, fields,branchCount, ...rest } = req.body;
    console.log(req.body);
    const user_id = req.userId;
    console.log(rest);

    const { error } = educenterValidationSchema.validate(rest, { abortEarly: false });
    if (error) {
      return res.status(400).json({ message: error.details.map((detail) => detail.message) });
    }

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

    const educenter = await EduCenter.create({ ...rest, branchCount: 0, CEO_id:user_id});

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

    res.status(201).json({ 
      educenter,
      subjects: subjects_educenter,
      fields: fields_educenter, 
     });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const updateEduCenter = async (req, res) => {
  try {
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

    // **Unique name & phone tekshirish (agar mavjud bo‘lsa)**
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

    res.status(200).json({ message: "EduCenter updated successfully", educenter });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteEduCenter = async (req, res) => {
  try {
    const educenter = await EduCenter.findByPk(req.params.id);
    if (!educenter) {
      return res.status(404).json({ error: "EduCenter not found" });
    }

    // **Bog‘liq ma’lumotlarni o‘chirish**
    await SubjectsOfEdu.destroy({ where: { edu_id: educenter.id } });
    await FieldsOfEdu.destroy({ where: { edu_id: educenter.id } });
    await Comment.destroy({ where: { edu_id: educenter.id } });

    // **Asosiy ta’lim markazini o‘chirish**
    await educenter.destroy();

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
  deleteEduCenter,
};
