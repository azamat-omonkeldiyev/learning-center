const express = require("express");
const {
  exportMyComments,
  exportMyEduCenters,
  exportMyResources,
  exportMyProfile,
  exportMyEnrollments,
} = require("../controller/my-all-data.controller");
const roleMiddleware = require("../rolemiddleware/roleAuth");

const router = express.Router();

/**
 * @swagger
 * /api/my-comments/export:
 *   get:
 *     summary: 💬 Export all user comments in Excel format
 *     description: 📝 Allows users to download their own comments in an Excel file
 *     tags:
 *       - 📂 My Data Export (EXCEL FORMAT)
 *     responses:
 *       200:
 *         description: 📄 Excel file will be downloaded
 *       500:
 *         description: ❌ Server error
 */
router.get("/my-comments/export", roleMiddleware(["admin", "superadmin", "user", "ceo"]), exportMyComments);

/**
 * @swagger
 * /api/my-edu-centers/export:
 *   get:
 *     summary: 🏫 Export all education centers of the user
 *     description: 🎓 Allows users to download their own education centers
 *     tags:
 *       - 📂 My Data Export (EXCEL FORMAT)
 *     responses:
 *       200:
 *         description: 📄 Excel file will be downloaded
 *       500:
 *         description: ❌ Server error
 */
router.get("/my-edu-centers/export", roleMiddleware(["admin", "superadmin", "user", "ceo"]), exportMyEduCenters);

/**
 * @swagger
 * /api/my-resources/export:
 *   get:
 *     summary: 📚 Export all user resources
 *     description: 🔗 Allows users to download their own resources
 *     tags:
 *       - 📂 My Data Export (EXCEL FORMAT)
 *     responses:
 *       200:
 *         description: 📄 Excel file will be downloaded
 *       500:
 *         description: ❌ Server error
 */
router.get("/my-resources/export", roleMiddleware(["admin", "superadmin", "user", "ceo"]), exportMyResources);

/**
 * @swagger
 * /api/my-profile/export:
 *   get:
 *     summary: 🧑‍💼 Export user profile
 *     description: 📋 Allows users to download their profile information
 *     tags:
 *       - 📂 My Data Export (EXCEL FORMAT)
 *     responses:
 *       200:
 *         description: 📄 Excel file will be downloaded
 *       404:
 *         description: ⚠️ User not found
 *       500:
 *         description: ❌ Server error
 */
router.get("/my-profile/export", roleMiddleware(["admin", "superadmin", "user", "ceo"]), exportMyProfile);

/**
 * @swagger
 * /api/my-enrollments/export:
 *   get:
 *     summary: 📜 Export user's enrolled courses
 *     description: 🏆 Allows users to download a list of courses they are enrolled in
 *     tags:
 *       - 📂 My Data Export (EXCEL FORMAT)
 *     responses:
 *       200:
 *         description: 📄 Excel file will be downloaded
 *       500:
 *         description: ❌ Server error
 */
router.get("/my-enrollments/export", roleMiddleware(["admin", "superadmin", "user", "ceo"]), exportMyEnrollments);

module.exports = router;
