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
 * /edu-centers:
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
 *       - in: query
 *         name: subject_id
 *         schema:
 *           type: integer
 *         description: Filter by subject ID (EduCenters related to this subject)
 *       - in: query
 *         name: field_id
 *         schema:
 *           type: integer
 *         description: Filter by field ID (EduCenters related to this field)
 *     responses:
 *       200:
 *         description: List of EduCenters retrieved successfully
 *       500:
 *         description: Server error
 */
router.get('/', getEduCenters);

/**
 * @swagger
 * /edu-centers/{id}:
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
 * /edu-centers:
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
 *             subjects: [1, 2, 3]  # REQUIRED
 *             fields: [4, 5]       # REQUIRED
 *     responses:
 *       201:
 *         description: EduCenter created successfully
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Server error
 *     description: |
 *       - `subjects` **required** → At least one subject ID must be provided.
 *       - `fields` **required** → At least one field ID must be provided.
 */
router.post('/', createEduCenter);

/**
 * @swagger
 * /edu-centers/{id}:
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
 *             subjects: [2, 3]   # Optional, but must be an array
 *             fields: [5, 6]     # Optional, but must be an array
 *     responses:
 *       200:
 *         description: EduCenter updated successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: EduCenter not found
 *       500:
 *         description: Server error
 *     description: |
 *       - Send only the fields you want to update.
 *       - If updating `subjects` or `fields`, send the **new** array of IDs.
 */
router.patch('/:id', updateEduCenter);

/**
 * @swagger
 * /edu-centers/{id}:
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
