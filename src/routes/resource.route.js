const express = require("express");
const router = express.Router();
const {
    getResources,
    getResource,
    createResource,
    updateResource,
    deleteResource
} = require('../controller/resource.controller');

// Resource Routes
/**
 * @swagger
 * /resources:
 *   get:
 *     summary: Get all Resources 📚
 *     tags: [Resources]
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
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: integer
 *         description: Filter by category ID
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: string
 *         description: Filter by user ID
 *     responses:
 *       200:
 *         description: List of Resources retrieved successfully
 *       500:
 *         description: Server error
 */
router.get('/', getResources);

/**
 * @swagger
 * /resources/{id}:
 *   get:
 *     summary: Get a Resource by ID 🔍
 *     tags: [Resources]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Resource ID
 *     responses:
 *       200:
 *         description: Resource details retrieved successfully
 *       404:
 *         description: Resource not found
 *       500:
 *         description: Server error
 */
router.get('/:id', getResource);

/**
 * @swagger
 * /resources:
 *   post:
 *     summary: Create a new Resource ➕
 *     tags: [Resources]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "Study Guide"
 *             image: "http://example.com/study-guide.jpg"
 *             file: "http://example.com/study-guide.pdf"
 *             link: "http://example.com/study-guide-link"
 *             description: "A comprehensive study guide for students"
 *             category_id: 1
 *             user_id: "550e8400-e29b-41d4-a716-446655440001"
 *     responses:
 *       201:
 *         description: Resource created successfully
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Server error
 */
router.post('/', createResource);

/**
 * @swagger
 * /resources/{id}:
 *   patch:
 *     summary: Update a Resource ✏️
 *     tags: [Resources]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Resource ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "Updated Study Guide"
 *             description: "An updated comprehensive study guide for students"
 *             image: "http://example.com/updated-study-guide.jpg"
 *     responses:
 *       200:
 *         description: Resource updated successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Resource not found
 *       500:
 *         description: Server error
 */
router.patch('/:id', updateResource);

/**
 * @swagger
 * /resources/{id}:
 *   delete:
 *     summary: Delete a Resource 🗑️
 *     tags: [Resources]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Resource ID
 *     responses:
 *       200:
 *         description: Resource deleted successfully
 *       404:
 *         description: Resource not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', deleteResource);

module.exports = router;