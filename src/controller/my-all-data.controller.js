const Comment = require("../models/comment.model");
const Branch = require("../models/branch.model");
const EduCenter = require("../models/edu_center.model");
const Resource = require("../models/resources.model");
const User = require("../models/user.model");
const resCategory = require("../models/res-category.model");
const ExcelJS = require("exceljs");

// ✅ Excel fayl yaratish funksiyasi
const createExcelFile = async (data, headers, sheetName, res, fileName) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(sheetName);

  sheet.addRow(headers);
  data.forEach((item) => sheet.addRow(Object.values(item)));

  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", `attachment; filename=${fileName}.xlsx`);

  await workbook.xlsx.write(res);
  res.end();
};

// ✅ Foydalanuvchi commentlarini export qilish
const exportMyComments = async (req, res) => {
    try {
      const userId = req.userId;
      const comments = await Comment.findAll({
        where: { user_id: userId },
        include: [
          { model: EduCenter, attributes: ["name"] }, 
          { model: Branch, attributes: ["name"] }, 
        ],
      });
  
      const formattedComments = comments.map((comment) => [
        comment.id,
        comment.text,
        comment.star,
        comment.edu_id ? comment.EduCenter?.name || "N/A" : "N/A",
        comment.branch_id ? comment.Branch?.name || "N/A" : "N/A",
        comment.user_id,
      ]);
  
      await createExcelFile(
        formattedComments,
        ["ID", "Text", "Stars", "Edu Center", "Branch", "User ID"],
        "Comments",
        res,
        "my_comments"
      );
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  };
  

// ✅ Foydalanuvchi edu centerlarini export qilish
const exportMyEduCenters = async (req, res) => {
    try {
      const userId = req.userId;
      const eduCenters = await EduCenter.findAll({
        where: { CEO_id: userId },
        include: [{ model: Region, attributes: ["name"] }], 
      });
  
      const formattedEduCenters = eduCenters.map((edu) => [
        edu.id,
        edu.name,
        edu.phone,
        edu.address,
        edu.region?.name || "N/A",
        edu.branchCount,
        edu.CEO_id,
        edu.image,
        edu.description,
      ]);
  
      await createExcelFile(
        formattedEduCenters,
        ["ID", "Name", "Phone", "Address", "Region", "Branch Count", "CEO ID", "Image", "Description"],
        "Edu Centers",
        res,
        "my_edu_centers"
      );
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  };
  

// ✅ Foydalanuvchi resurslarini export qilish
const exportMyResources = async (req, res) => {
    try {
      const userId = req.userId;
      const resources = await Resource.findAll({
        where: { user_id: userId },
        include: [{ model: resCategory, attributes: ["name"] }],
      });
      console.log(resources, "ddadsdsd")
      const formattedResources = resources.map((resource) => [
        resource.id,
        resource.name,
        resource.category_id || "N/A",
        resource.user_id,
        resource.image,
        resource.file,
        resource.link,
        resource.description,
      ]);
  
      await createExcelFile(
        formattedResources,
        ["ID", "Name", "Category", "User ID", "Image", "File", "Link", "Description"],
        "Resources",
        res,
        "my_resources"
      );
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  };

// ✅ Foydalanuvchi profilini export qilish
const exportMyProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findByPk(userId, {
      attributes: ["id", "fullname", "email","phone", "role", "createdAt"],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    await createExcelFile(
        [[user.id, user.fullname, user.email, user.role, user.phone, user.createdAt]], 
        ["ID", "Fullname", "Email", "Role", "Phone", "Created At"],
        "Profile",
        res,
        "my_profile"
      );      
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const exportMyEnrollments = async (req, res) => {
    try {
      const userId = req.userId;
      
      const enrollments = await Enrollment.findAll({
        where: { user_id: userId },
        include: [
          { model: EduCenter, attributes: ["name", "address"] },
          { model: Branch, attributes: ["name", "address"] },
        ],
      });
  
      const formattedEnrollments = enrollments.map((enroll) => [
        enroll.id,
        enroll.date.toISOString().split("T")[0], 
        enroll.edu_id ? enroll.edu_center?.name : enroll.branch?.name, 
        enroll.edu_id ? enroll.edu_center?.address : enroll.branch?.address,
        enroll.edu_id ? "EduCenter" : "Branch",
      ]);
  
      await createExcelFile(
        formattedEnrollments,
        ["ID", "Date", "Center/Branch Name", "Address", "Type"],
        "Enrollments",
        res,
        "my_enrollments"
      );
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  };
  

module.exports = {
  exportMyComments,
  exportMyEduCenters,
  exportMyResources,
  exportMyProfile,
  exportMyEnrollments
};
