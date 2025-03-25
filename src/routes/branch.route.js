const express = require("express");
const router = express.Router();
const {
    getBranches,
    getBranch,
    createBranch,
    updateBranch,
    deleteBranch
} = require('../controller/branch.controller');
const roleMiddleware = require("../rolemiddleware/roleAuth");

// Branch Routes
/**
 * @swagger
 * /branches:
 *   get:
 *     summary: Get all Branches 🌿
 *     tags: [Branches]
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
 *       - in: query
 *         name: edu_id
 *         schema:
 *           type: string
 *         description: Filter by EduCenter ID
 *       - in: query
 *         name: subject_id
 *         schema:
 *           type: integer
 *         description: Filter by Subject ID
 *       - in: query
 *         name: field_id
 *         schema:
 *           type: integer
 *         description: Filter by Field ID
 *     responses:
 *       200:
 *         description: List of Branches retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               total: 2
 *               page: 1
 *               totalPages: 1
 *               data:
 *                 - id: "550e8400-e29b-41d4-a716-446655440000"
 *                   name: "Branch A"
 *                   phone: "+1234567890"
 *                   subjects: [1, 2]
 *                   fields: [3, 4]
 *       500:
 *         description: Server error
 */

router.get('/',roleMiddleware(["admin", "superadmin", "user", "ceo"]), getBranches);

/**
 * @swagger
 * /branches/{id}:
 *   get:
 *     summary: Get a Branch by ID 🔍
 *     tags: [Branches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Branch ID
 *     responses:
 *       200:
 *         description: Branch details retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               id: "550e8400-e29b-41d4-a716-446655440000"
 *               name: "Branch A"
 *               phone: "+1234567890"
 *               address: "789 Oak St"
 *               subjects: [1, 2]
 *               fields: [3, 4]
 *       404:
 *         description: Branch not found
 *       500:
 *         description: Server error
 */
router.get('/:id',roleMiddleware(["admin", "superadmin", "user", "ceo"]), getBranch);

/**
 * @swagger
 * /branches:
 *   post:
 *     summary: Create a new Branch ➕
 *     tags: [Branches]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "Branch A"
 *             phone: "+1234567890"
 *             image: "http://example.com/branch.jpg"
 *             address: "789 Oak St"
 *             region_id: 1
 *             edu_id: "550e8400-e29b-41d4-a716-446655440000"
 *             subjects: [1, 2]
 *             fields: [3, 4]
 *     responses:
 *       201:
 *         description: Branch created successfully
 *         content:
 *           application/json:
 *             example:
 *               id: "550e8400-e29b-41d4-a716-446655440000"
 *               name: "Branch A"
 *               subjects: [1, 2]
 *               fields: [3, 4]
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Server error
 */
router.post('/',roleMiddleware(["admin", "ceo"]), createBranch);

/**
 * @swagger
 * /branches/{id}:
 *   patch:
 *     summary: Update a Branch ✏️
 *     tags: [Branches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Branch ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "Updated Branch A"
 *             address: "101 Pine St"
 *             subjects: [1, 3]
 *             fields: [2, 5]
 *     responses:
 *       200:
 *         description: Branch updated successfully
 *         content:
 *           application/json:
 *             example:
 *               id: "550e8400-e29b-41d4-a716-446655440000"
 *               name: "Updated Branch A"
 *               address: "101 Pine St"
 *               subjects: [1, 3]
 *               fields: [2, 5]
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Branch not found
 *       500:
 *         description: Server error
 */
router.patch('/:id',roleMiddleware(["admin", "superadmin", "ceo"]), updateBranch);

/**
 * @swagger
 * /branches/{id}:
 *   delete:
 *     summary: Delete a Branch 🗑️
 *     tags: [Branches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Branch ID
 *     responses:
 *       200:
 *         description: Branch deleted successfully
 *       404:
 *         description: Branch not found
 *       500:
 *         description: Server error
 */
router.delete('/:id',roleMiddleware(["admin", "ceo"]), deleteBranch);

module.exports = router;
