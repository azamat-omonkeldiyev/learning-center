const Branch = require("../models/branch.model");
const EduCenter = require("../models/edu_center.model");
const Enrollment = require("../models/course_register.model");
const branchValidationSchema = require("../validation/branch.validate");
const { Op } = require("sequelize");
const BranchSubject = require("../models/branch_subjects.model");
const BranchField = require("../models/branch_fields.model");
const Subjects = require("../models/subject.model");
const Fields = require("../models/fields.model");
const FieldsOfEdu = require("../models/edu_center_fields.model");

const getBranches = async (req, res) => {
  try {
<<<<<<< HEAD
      const { page, limit, sortField, sortOrder, name, edu_id } = req.query;

      const queryOptions = {
          include: [
              { model: EduCenter, attributes: ["id", "name"] },
              { model: Enrollment, attributes: ["id", "date"] },
          ],
          where: {},
          order: [],
      };
=======
    const { page, limit, sort, name, edu_id, subject_id, field_id } = req.query;

    const queryOptions = {
      include: [
        { model: EduCenter, attributes: ["id", "name"] },
        { model: Enrollment, attributes: ["id", "date"] },
        { model: Subjects, through: { attributes: [] }, as: "subjects" },
        { model: FieldsOfEdu, through: { attributes: [] }, as: "fields" },
      ],
      where: {},
      order: [],
    };
>>>>>>> 0bf504b8e0af465783a396931ee4209b0a32cc3c

      if (page && limit) {
          queryOptions.limit = parseInt(limit);
          queryOptions.offset = (parseInt(page) - 1) * parseInt(limit);
      }

<<<<<<< HEAD
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
      if (edu_id) {
          queryOptions.where.edu_id = edu_id;
      }
=======
    if (sort) {
      const [sortField, sortOrder] = sort.split(":");
      queryOptions.order.push([sortField || "createdAt", sortOrder?.toUpperCase() === "DESC" ? "DESC" : "ASC"]);
    } else {
      queryOptions.order.push(["createdAt", "ASC"]);
    }

    if (name) queryOptions.where.name = { [Op.like]: `%${name}%` };
    if (edu_id) queryOptions.where.edu_id = edu_id;
    if (subject_id) queryOptions.include[2].where = { id: subject_id };
    if (field_id) queryOptions.include[3].where = { id: field_id };
>>>>>>> 0bf504b8e0af465783a396931ee4209b0a32cc3c

      const branches = await Branch.findAndCountAll(queryOptions);

<<<<<<< HEAD
      const response = {
          data: branches.rows,
          total: branches.count,
      };

      if (page && limit) {
          response.page = parseInt(page);
          response.totalPages = Math.ceil(branches.count / limit);
      }

      res.json(response);
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
=======
    res.json({
      data: branches.rows,
      total: branches.count,
      ...(page && limit && { page: parseInt(page), totalPages: Math.ceil(branches.count / limit) }),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
>>>>>>> 0bf504b8e0af465783a396931ee4209b0a32cc3c
  }
};

const getBranch = async (req, res) => {
  try {
    const branch = await Branch.findByPk(req.params.id, {
      include: [
        { model: EduCenter, attributes: ["id", "name"] },
        { model: Enrollment, attributes: ["id", "date"] },
        { model: Subjects, through: { attributes: [] }, as: "subjects" },
        { model: Fields, through: { attributes: [] }, as: "fields" },
      ],
    });
    if (!branch) return res.status(404).json({ error: "Branch not found" });

    res.json(branch);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ CREATE BRANCH: CEO faqat o‘zining EduCenteriga branch qo‘sha oladi
const createBranch = async (req, res) => {
  try {
    const { fields, subjects, edu_id, ...rest } = req.body;

    const { error } = branchValidationSchema.validate(rest, { abortEarly: false });
    if (error) {
      return res.status(400).json({ message: error.details.map((detail) => detail.message) });
    }

    if (req.userRole === "ceo") {
      const userEdu = await EduCenter.findOne({ where: { id: edu_id, user_id: req.userId } });
      if (!userEdu) {
        return res.status(403).json({ message: "You can only create branches for your own education center" });
      }
    }

    const existingEdu = await Branch.findOne({ where: { name: rest.name } });
    if (existingEdu) {
      return res.status(400).json({ message: "This education branch name already exists" });
    }
    const existingPhone = await Branch.findOne({ where: { phone: rest.phone } });
    if (existingPhone) {
      return res.status(400).json({ message: "This phone number is already in use" });
    }

    if (subjects && subjects.length > 0) {
      const validSubjects = await Subjects.findAll({ where: { id: subjects } });
      const invalidSubjects = subjects.filter((id) => !validSubjects.some((s) => s.id === id));
      if (invalidSubjects.length > 0) {
        return res.status(400).json({ message: `Invalid subject IDs: ${invalidSubjects.join(", ")}` });
      }
    }

    if (fields && fields.length > 0) {
      const validFields = await Fields.findAll({ where: { id: fields } });
      const invalidFields = fields.filter((id) => !validFields.some((f) => f.id === id));
      if (invalidFields.length > 0) {
        return res.status(400).json({ message: `Invalid field IDs: ${invalidFields.join(", ")}` });
      }
    }

    const branch = await Branch.create({ edu_id, ...rest });

    if (subjects && subjects.length > 0) {
      const subjects_branch = subjects.map((id) => ({ branch_id: branch.id, subject_id: id }));
      await BranchSubject.bulkCreate(subjects_branch);
    }

    if (fields && fields.length > 0) {
      const fields_branch = fields.map((id) => ({ branch_id: branch.id, field_id: id }));
      await BranchField.bulkCreate(fields_branch);
    }

    res.status(201).json({ branch });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ UPDATE BRANCH: Faqat CEO o‘zining branchini o‘zgartira oladi
const updateBranch = async (req, res) => {
  try {
    const { error } = branchValidationSchema.fork(Object.keys(req.body), (schema) => schema.required()).validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ message: error.details.map((detail) => detail.message) });
    }

    const branch = await Branch.findByPk(req.params.id);
    if (!branch) {
      return res.status(404).json({ error: "Branch not found" });
    }

    if (req.userRole === "ceo") {
      const userEdu = await EduCenter.findOne({ where: { id: branch.edu_id, user_id: req.userId } });
      if (!userEdu) {
        return res.status(403).json({ message: "You can only update branches of your own education center" });
      }
    }

    if (req.body.name) {
      const existingBranch = await Branch.findOne({ where: { name: req.body.name, id: { [Op.ne]: branch.id } } });
      if (existingBranch) {
        return res.status(400).json({ message: "This branch name already exists" });
      }
    }

    if (req.body.phone) {
      const existingPhone = await Branch.findOne({ where: { phone: req.body.phone, id: { [Op.ne]: branch.id } } });
      if (existingPhone) {
        return res.status(400).json({ message: "This phone number is already in use" });
      }
    }

    if (req.body.subjects) {
      await BranchSubject.destroy({ where: { branch_id: branch.id } });
      const subjectLinks = req.body.subjects.map((id) => ({ branch_id: branch.id, subject_id: id }));
      await BranchSubject.bulkCreate(subjectLinks);
    }

    if (req.body.fields) {
      await BranchField.destroy({ where: { branch_id: branch.id } });
      const fieldLinks = req.body.fields.map((id) => ({ branch_id: branch.id, field_id: id }));
      await BranchField.bulkCreate(fieldLinks);
    }

    await branch.update(req.body, { fields: Object.keys(req.body) });

    res.status(200).json({ message: "Branch updated successfully", branch });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ DELETE BRANCH: Faqat CEO o‘zining branchini o‘chira oladi
const deleteBranch = async (req, res) => {
  try {
    const branch = await Branch.findByPk(req.params.id);
    if (!branch) return res.status(404).json({ error: "Branch not found" });

    if (req.useRole === "ceo") {
      const userEdu = await EduCenter.findOne({ where: { id: branch.edu_id, user_id: req.userId } });
      if (!userEdu) {
        return res.status(403).json({ message: "You can only delete branches of your own education center" });
      }
    }

    await BranchSubject.destroy({ where: { branch_id: branch.id } });
    await BranchField.destroy({ where: { branch_id: branch.id } });
    await branch.destroy();

    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  getBranches,
  getBranch,
  createBranch,
  updateBranch,
  deleteBranch,
};
