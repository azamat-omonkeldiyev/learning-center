const express = require("express");
const router = express.Router();
const {
    getFields,
    getField,
    createField,
    updateField,
    deleteField
} = require('../controller/fields.controller');
const roleMiddleware = require("../rolemiddleware/roleAuth");

// Fields Routes
/**
 * @swagger
 * /fields:
 *   get:
 *     summary: Get all Fields 🧠
 *     tags: [Fields]
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
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by name (partial match)
 *     responses:
 *       200:
 *         description: List of Fields retrieved successfully
 *       500:
 *         description: Server error
 */
router.get('/',roleMiddleware(["admin", "superadmin", "user", "ceo"]), getFields);

/**
 * @swagger
 * /fields/{id}:
 *   get:
 *     summary: Get a Field by ID 🔍
 *     tags: [Fields]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Field ID
 *     responses:
 *       200:
 *         description: Field details retrieved successfully
 *       404:
 *         description: Field not found
 *       500:
 *         description: Server error
 */
router.get('/:id',roleMiddleware(["admin", "superadmin", "user", "ceo"]), getField);

/**
 * @swagger
 * /fields:
 *   post:
 *     summary: Create a new Field ➕
 *     tags: [Fields]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "Science"
 *             image: "http://example.com/science.jpg"
 *     responses:
 *       201:
 *         description: Field created successfully
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Server error
 */
router.post('/',roleMiddleware(["admin"]), createField);

/**
 * @swagger
 * /fields/{id}:
 *   patch:
 *     summary: Update a Field ✏️
 *     tags: [Fields]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Field ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "Advanced Science"
 *             image: "http://example.com/advanced-science.jpg"
 *     responses:
 *       200:
 *         description: Field updated successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Field not found
 *       500:
 *         description: Server error
 */
router.patch('/:id',roleMiddleware(["admin", "superadmin"]), updateField);

/**
 * @swagger
 * /fields/{id}:
 *   delete:
 *     summary: Delete a Field 🗑️
 *     tags: [Fields]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Field ID
 *     responses:
 *       200:
 *         description: Field deleted successfully
 *       404:
 *         description: Field not found
 *       500:
 *         description: Server error
 */
router.delete('/:id',roleMiddleware(["admin"]), deleteField);

module.exports = router;