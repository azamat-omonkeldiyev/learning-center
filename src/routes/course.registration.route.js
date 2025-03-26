const express = require("express");
const router = express.Router();
const {
    getEnrollments,
    getEnrollment,
    createEnrollment,
    updateEnrollment,
    deleteEnrollment
} = require('../controller/course.registration.controller');

/**
 * @swagger
 * /enrollments:
 *   get:
 *     summary: Get all Course Registrations 📋
 *     tags: [Course Registrations]
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
 *         name: sortField
 *         schema:
 *           type: string
 *           enum: [date, createdAt]
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: ASC
 *         description: Sort order
 *       - in: query
 *         name: edu_id
 *         schema:
 *           type: string
 *         description: Filter by EduCenter ID
 *       - in: query
 *         name: branch_id
 *         schema:
 *           type: string
 *         description: Filter by Branch ID
 *     responses:
 *       200:
 *         description: List of Course Registrations retrieved successfully
 *       500:
 *         description: Server error
 */
router.get('/', getEnrollments);

/**
 * @swagger
 * /enrollments/{id}:
 *   get:
 *     summary: Get an Enrollment by ID 🔍
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
 *         description: Enrollment details retrieved successfully
 *       404:
 *         description: Enrollment not found
 *       500:
 *         description: Server error
 */
router.get('/:id', getEnrollment);

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
 *             user_id: "550e8400-e29b-41d4-a716-446655440002"
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
router.post('/', createEnrollment);

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
router.patch('/:id', updateEnrollment);

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
router.delete('/:id', deleteEnrollment);

module.exports = router;