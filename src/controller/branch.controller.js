const Branch = require("../models/branch.model");
const EduCenter = require("../models/edu_center.model");
const Enrollment = require("../models/course_register.model");
const branchValidationSchema = require("../validation/branch.validate");
const { Op } = require("sequelize");
const SubjectsOfEdu = require("../models/edu_center_subjects.model");
const FieldsOfEdu = require("../models/edu_center_fields.model");

const getBranches = async (req, res) => {
  try {
    const { page, limit, sort, name, edu_id } = req.query;

    const queryOptions = {
      include: [
        { model: EduCenter, attributes: ["id", "name"] },
        { model: Enrollment, attributes: ["id", "date"] },
      ],
      where: {},
      order: [],
    };

    if (page && limit) {
      queryOptions.limit = parseInt(limit);
      queryOptions.offset = (parseInt(page) - 1) * parseInt(limit);
    }

    if (sort) {
      const [sortField, sortOrder] = sort.split(":");
      queryOptions.order.push([
        sortField || "createdAt",
        sortOrder && sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC",
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

    const branches = await Branch.findAndCountAll(queryOptions);

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
  }
};

const getBranch = async (req, res) => {
  try {
    const branch = await Branch.findByPk(req.params.id, {
      include: [
        { model: EduCenter, attributes: ["id", "name"] },
        { model: Enrollment, attributes: ["id", "date"] },
      ],
    });
    if (!branch) return res.status(404).json({ error: "Branch not found" });

    res.json(branch);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const createBranch = async (req, res) => {
  try {
    const { fields,subjects, ...rest } = req.body;
    const { error } = branchValidationSchema.validate(rest, {
      abortEarly: false,
    });
    console.log(fields, subjects)

    if (error) {
      return res
        .status(400)
        .json({ message: error.details.map((detail) => detail.message) });
    };
    const branch = await Branch.create(req.body);
    console.log(branch.id, "salomlarrrrrrrrrrr")
    let subjects_educenter;
    if(subjects){
      subjects_educenter = subjects.map((id) => ({
        edu_id: branch.id,
        field_id: id,
      }));
      await SubjectsOfEdu.bulkCreate(subjects_educenter);
      console.log(subjects_educenter);
    };

    let fields_educenter;
    if(fields){
      fields_educenter = fields.map((id) => ({
        edu_id: branch.id,
        field_id: id,
      }));
      await FieldsOfEdu.bulkCreate(fields_educenter);
      console.log(fields_educenter);
    }

    if(!subjects && !fields){
      return res.status(400).json({message: "fields or subjects is required"})
    }


    res.status(201).json(branch);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const updateBranch = async (req, res) => {
  try {
    const branch = await Branch.findByPk(req.params.id);
    if (!branch) return res.status(404).json({ error: "Branch not found" });

    const { error } = branchValidationSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(400)
        .json({ message: error.details.map((detail) => detail.message) });
    }

    await branch.update(req.body);
    res.json(branch);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteBranch = async (req, res) => {
  try {
    const branch = await Branch.findByPk(req.params.id);
    if (!branch) return res.status(404).json({ error: "Branch not found" });

    await branch.destroy();
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    console.log(error);
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
