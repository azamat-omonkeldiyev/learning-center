const express = require("express");
const { createAdmin, deleteAdmin } = require("./../controller/user.controller");
const roleMiddleware = require("../rolemiddleware/roleAuth");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: AdminControl
 *   description: Admin management APIs
 */

/**
 * @swagger
 * /admin:
 *   post:
 *     summary: Create a new admin
 *     tags: [AdminControl]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullname
 *               - email
 *               - phone
 *               - password
 *               - role
 *               - region_id
 *             properties:
 *               fullname:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "admin@example.com"
 *               phone:
 *                 type: string
 *                 example: "912345678"
 *               password:
 *                 type: string
 *                 example: "SecurePassword123!"
 *               role:
 *                 type: string
 *                 enum: [admin, superadmin]
 *                 example: "admin"
 *               region_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Admin successfully created
 *       400:
 *         description: Validation error
 *       403:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */


router.post("/",roleMiddleware(["admin"]), createAdmin);

/**
 * @swagger
 * /api/admin/{id}:
 *   delete:
 *     summary: Delete an admin by ID
 *     tags: [AdminControl]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Admin ID
 *     responses:
 *       200:
 *         description: Admin successfully deleted
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Internal server error
 */

router.delete("/:id",roleMiddleware(["admin"]), deleteAdmin)

module.exports = router;