const express = require("express");
const router = express.Router();
const {
    getBranches,
    getBranch,
    createBranch,
    updateBranch,
    deleteBranch
} = require('../controller/branch.controller');

/**
 * @swagger
 * /branches:
 *   get:
 *     summary: Get all Branches 🏢
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
 *         name: edu_id
 *         schema:
 *           type: string
 *         description: Filter by EduCenter ID
 *     responses:
 *       200:
 *         description: List of Branches retrieved successfully
 *       500:
 *         description: Server error
 */
router.get('/', getBranches);

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
 *       404:
 *         description: Branch not found
 *       500:
 *         description: Server error
 */
router.get('/:id', getBranch);

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
 *     responses:
 *       201:
 *         description: Branch created successfully
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Server error
 */
router.post('/', createBranch);

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
 *     responses:
 *       200:
 *         description: Branch updated successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Branch not found
 *       500:
 *         description: Server error
 */
router.patch('/:id', updateBranch);

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
router.delete('/:id', deleteBranch);

module.exports = router;