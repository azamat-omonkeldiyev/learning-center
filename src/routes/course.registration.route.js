const express = require("express");
const router = express.Router();
const {
    getEnrollments,
    getEnrollment,
    createEnrollment,
    updateEnrollment,
    deleteEnrollment,
    getMyEnrollments
} = require('../controller/course.registration.controller');
const roleMiddleware = require("../rolemiddleware/roleAuth");

// Enrollment Routes
/**
 * @swagger
 * /enrollments:
 *   get:
 *     summary: Get all Enrollments 📋
 *     tags: [Enrollments]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Field to sort by (e.g., createdAt:DESC)
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: string
 *         description: Filter by user ID
 *       - in: query
 *         name: edu_id
 *         schema:
 *           type: string
 *         description: Filter by EduCenter ID
 *     responses:
 *       200:
 *         description: List of Enrollments retrieved successfully
 *       500:
 *         description: Server error
 */
router.get('/',roleMiddleware(["admin"]), getEnrollments);

/**
 * @swagger
 * components:
 *   schemas:
 *     Enrollment:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         date:
 *           type: string
 *           format: date
 *           example: "2025-03-24"
 *         edu_id:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         branch_id:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440003"
 *         user_id:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440002"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-03-26T12:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-03-26T12:30:00Z"
 * 
 * /enrollments:
 *   get:
 *     summary: Get all Enrollments 📋
 *     tags: [Enrollments]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Field to sort by (e.g., createdAt:DESC)
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: string
 *         description: Filter by user ID
 *       - in: query
 *         name: edu_id
 *         schema:
 *           type: string
 *         description: Filter by EduCenter ID
 *     responses:
 *       200:
 *         description: List of Enrollments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 10
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Enrollment'
 *       500:
 *         description: Server error
 */
router.get('/:id',roleMiddleware(["admin", "superadmin", "user", "ceo"]), getEnrollment);

/**
 * @swagger
 * /enrollments:
 *   post:
 *     summary: Create a new Enrollment ➕
 *     tags: [Enrollments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             date: "2025-03-24"
 *             edu_id: "550e8400-e29b-41d4-a716-446655440000"
 *             branch_id: "550e8400-e29b-41d4-a716-446655440003"
 *     responses:
 *       201:
 *         description: Enrollment created successfully
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Server error
 */
router.post('/',roleMiddleware(["admin", "superadmin", "user", "ceo"]), createEnrollment);

/**
 * @swagger
 * /enrollments/my-enrollments:
 *   get:
 *     summary: Get a Personal Enrollment
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Enrollment list retrieved successfully
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */

router.get("/my-enrollments", roleMiddleware(["user", "admin","superadmin", "ceo"]), getMyEnrollments);


/**
 * @swagger
 * /enrollments/{id}:
 *   patch:
 *     summary: Update an Enrollment ✏️
 *     tags: [Enrollments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Enrollment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             date: "2025-03-25"
 *     responses:
 *       200:
 *         description: Enrollment updated successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Enrollment not found
 *       500:
 *         description: Server error
 */
router.patch('/:id',roleMiddleware(["admin", "superadmin", "user", "ceo"]), updateEnrollment);

/**
 * @swagger
 * /enrollments/{id}:
 *   delete:
 *     summary: Delete an Enrollment 🗑️
 *     tags: [Enrollments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Enrollment ID
 *     responses:
 *       200:
 *         description: Enrollment deleted successfully
 *       404:
 *         description: Enrollment not found
 *       500:
 *         description: Server error
 */
router.delete('/:id',roleMiddleware(["admin", "superadmin", "user", "ceo"]), deleteEnrollment);

module.exports = router;