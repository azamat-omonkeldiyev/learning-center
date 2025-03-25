const express = require("express");
const router = express.Router();
const {
    getResCategories,
    getResCategory,
    createResCategory,
    updateResCategory,
    deleteResCategory
} = require('../controller/res-category.controller');

// Resource Category Routes
/**
 * @swagger
 * /res-categories:
 *   get:
 *     summary: Get all Resource Categories 📂
 *     tags: [Resource Categories]
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
 *         description: List of Resource Categories retrieved successfully
 *       500:
 *         description: Server error
 */
router.get('/', getResCategories);

/**
 * @swagger
 * /res-categories/{id}:
 *   get:
 *     summary: Get a Resource Category by ID 🔍
 *     tags: [Resource Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Resource Category ID
 *     responses:
 *       200:
 *         description: Resource Category details retrieved successfully
 *       404:
 *         description: Resource Category not found
 *       500:
 *         description: Server error
 */
router.get('/:id', getResCategory);

/**
 * @swagger
 * /res-categories:
 *   post:
 *     summary: Create a new Resource Category ➕
 *     tags: [Resource Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "Study Materials"
 *             image: "http://example.com/study-materials.jpg"
 *     responses:
 *       201:
 *         description: Resource Category created successfully
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Server error
 */
router.post('/', createResCategory);

/**
 * @swagger
 * /res-categories/{id}:
 *   patch:
 *     summary: Update a Resource Category ✏️
 *     tags: [Resource Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Resource Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "Updated Study Materials"
 *             image: "http://example.com/updated-study-materials.jpg"
 *     responses:
 *       200:
 *         description: Resource Category updated successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Resource Category not found
 *       500:
 *         description: Server error
 */
router.patch('/:id', updateResCategory);

/**
 * @swagger
 * /res-categories/{id}:
 *   delete:
 *     summary: Delete a Resource Category 🗑️
 *     tags: [Resource Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Resource Category ID
 *     responses:
 *       200:
 *         description: Resource Category deleted successfully
 *       404:
 *         description: Resource Category not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', deleteResCategory);

module.exports = router;