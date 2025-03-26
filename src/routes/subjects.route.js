const express = require("express");
const router = express.Router();
const {
    getSubjects,
    getSubject,
    createSubject,
    updateSubject,
    deleteSubject
} = require('../controller/subjects.controller');

/**
 * @swagger
 * /subjects:
 *   get:
 *     summary: Get all Subjects 📖
 *     tags: [Subjects]
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
 *           enum: [name, createdAt]
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
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by name (partial match)
 *     responses:
 *       200:
 *         description: List of Subjects retrieved successfully
 *       500:
 *         description: Server error
 */
router.get('/', getSubjects);

/**
 * @swagger
 * /subjects/{id}:
 *   get:
 *     summary: Get a Subject by ID 🔍
 *     tags: [Subjects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Subject ID
 *     responses:
 *       200:
 *         description: Subject details retrieved successfully
 *       404:
 *         description: Subject not found
 *       500:
 *         description: Server error
 */
router.get('/:id', getSubject);

/**
 * @swagger
 * /subjects:
 *   post:
 *     summary: Create a new Subject ➕
 *     tags: [Subjects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "Mathematics"
 *             image: "http://example.com/math.jpg"
 *     responses:
 *       201:
 *         description: Subject created successfully
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Server error
 */
router.post('/', createSubject);

/**
 * @swagger
 * /subjects/{id}:
 *   patch:
 *     summary: Update a Subject ✏️
 *     tags: [Subjects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Subject ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "Advanced Mathematics"
 *             image: "http://example.com/advanced-math.jpg"
 *     responses:
 *       200:
 *         description: Subject updated successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Subject not found
 *       500:
 *         description: Server error
 */
router.patch('/:id', updateSubject);

/**
 * @swagger
 * /subjects/{id}:
 *   delete:
 *     summary: Delete a Subject 🗑️
 *     tags: [Subjects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Subject ID
 *     responses:
 *       200:
 *         description: Subject deleted successfully
 *       404:
 *         description: Subject not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', deleteSubject);

module.exports = router;