const express = require("express");
const router = express.Router();
const {
    getEduCenters,
    getEduCenter,
    createEduCenter,
    updateEduCenter,
    deleteEduCenter
} = require('../controller/edu_center.controller');
const roleMiddleware = require("../rolemiddleware/roleAuth");

/**
 * @swagger
 * components:
 *   schemas:
 *     EduCenter:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         name:
 *           type: string
 *           example: "EduCenter A"
 *         phone:
 *           type: string
 *           example: "+1234567890"
 *         image:
 *           type: string
 *           format: uri
 *           example: "http://example.com/educenter.jpg"
 *         address:
 *           type: string
 *           example: "123 Main St"
 *         region_id:
 *           type: integer
 *           example: 1
 *         description:
 *           type: string
 *           example: "A leading education center"
 *         subjects:
 *           type: array
 *           items:
 *             type: integer
 *           example: [1, 2, 3]
 *         fields:
 *           type: array
 *           items:
 *             type: integer
 *           example: [4, 5]
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-03-26T12:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-03-26T12:30:00Z"
 * 
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
 *         description: List of EduCenters retrieved successfully
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
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/EduCenter'
 *       500:
 *         description: Server error
 */

router.get('/', roleMiddleware(["admin", "superadmin","ceo", "user"]), getEduCenters);

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
router.get('/:id',roleMiddleware(["admin", "superadmin","ceo", "user"]), getEduCenter);

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
router.post('/',roleMiddleware(["admin","ceo"]), createEduCenter);

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
router.patch('/:id',roleMiddleware(["admin", "superadmin","ceo"]), updateEduCenter);

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
router.delete('/:id',roleMiddleware(["admin","ceo"]), deleteEduCenter);

module.exports = router;
