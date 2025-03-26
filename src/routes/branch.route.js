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
 * tags:
 *   name: Branches
 *   description: Branch management APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Branch:
 *       type: object
 *       required:
 *         - name
 *         - phone
 *         - address
 *         - region_id
 *         - edu_id
 *       properties:
 *         name:
 *           type: string
 *           example: "Branch A"
 *         phone:
 *           type: string
 *           example: "+1234567890"
 *         address:
 *           type: string
 *           example: "789 Oak St"
 *         image:
 *           type: string
 *           format: uri
 *           example: "http://example.com/branch.jpg"
 *         region_id:
 *           type: integer
 *           example: 1
 *         edu_id:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         subjects:
 *           type: array
 *           items:
 *             type: integer
 *           example: [1, 2]
 *         fields:
 *           type: array
 *           items:
 *             type: integer
 *           example: [3, 4]
 */

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
 *                   example: 1
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Branch'
 *       400:
 *         description: Invalid query parameters
 *       500:
 *         description: Server error
 */

router.get('/', roleMiddleware(["admin", "superadmin", "user", "ceo"]), getBranches);

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
 *             schema:
 *               $ref: '#/components/schemas/Branch'
 *       404:
 *         description: Branch not found
 *       500:
 *         description: Server error
 */
router.get('/:id', roleMiddleware(["admin", "superadmin", "user", "ceo"]), getBranch);

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
 *           schema:
 *             $ref: '#/components/schemas/Branch'
 *     responses:
 *       201:
 *         description: Branch created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Branch'
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Server error
 */
router.post('/', roleMiddleware(["admin", "ceo"]), createBranch);

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
 *           schema:
 *             $ref: '#/components/schemas/Branch'
 *     responses:
 *       200:
 *         description: Branch updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Branch'
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Branch not found
 *       500:
 *         description: Server error
 */
router.patch('/:id', roleMiddleware(["admin", "superadmin", "ceo"]), updateBranch);

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
router.delete('/:id', roleMiddleware(["admin", "ceo"]), deleteBranch);

module.exports = router;
