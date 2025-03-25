const express = require("express");
const router = express.Router();
const {
    getEduCenters,
    getEduCenter,
    createEduCenter,
    updateEduCenter,
    deleteEduCenter
} = require('../controller/edu_center.controller');

// EduCenter Routes
/**
 * @swagger
 * /educenters:
 *   get:
 *     summary: Get all EduCenters 🏫
 *     tags: [EduCenters]
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
 *         name: region_id
 *         schema:
 *           type: integer
 *         description: Filter by region ID
 *     responses:
 *       200:
 *         description: List of EduCenters retrieved successfully
 *       500:
 *         description: Server error
 */
router.get('/', getEduCenters);

/**
 * @swagger
 * /educenters/{id}:
 *   get:
 *     summary: Get an EduCenter by ID 🔍
 *     tags: [EduCenters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: EduCenter ID
 *     responses:
 *       200:
 *         description: EduCenter details retrieved successfully
 *       404:
 *         description: EduCenter not found
 *       500:
 *         description: Server error
 */
router.get('/:id', getEduCenter);

/**
 * @swagger
 * /educenters:
 *   post:
 *     summary: Create a new EduCenter ➕
 *     tags: [EduCenters]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "EduCenter A"
 *             phone: "+1234567890"
 *             image: "http://example.com/educenter.jpg"
 *             address: "123 Main St"
 *             region_id: 1
 *             branchCount: 3
 *             CEO_id: "550e8400-e29b-41d4-a716-446655440001"
 *             description: "A leading education center"
 *     responses:
 *       201:
 *         description: EduCenter created successfully
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Server error
 */
router.post('/', createEduCenter);

/**
 * @swagger
 * /educenters/{id}:
 *   patch:
 *     summary: Update an EduCenter ✏️
 *     tags: [EduCenters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: EduCenter ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "Updated EduCenter A"
 *             phone: "+1234567890"
 *             address: "456 Main St"
 *     responses:
 *       200:
 *         description: EduCenter updated successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: EduCenter not found
 *       500:
 *         description: Server error
 */
router.patch('/:id', updateEduCenter);

/**
 * @swagger
 * /educenters/{id}:
 *   delete:
 *     summary: Delete an EduCenter 🗑️
 *     tags: [EduCenters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: EduCenter ID
 *     responses:
 *       200:
 *         description: EduCenter deleted successfully
 *       404:
 *         description: EduCenter not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', deleteEduCenter);

module.exports = router;