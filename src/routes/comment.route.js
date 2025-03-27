const express = require("express");
const router = express.Router();
const {
    getComments,
    getComment,
    createComment,
    updateComment,
    deleteComment
} = require('../controller/comment.controller');
const roleMiddleware = require("../rolemiddleware/roleAuth");

// Comment Routes
/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         text:
 *           type: string
 *           example: "Great learning center!"
 *         star:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           example: 5
 *         edu_id:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440001"
 *         user_id:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440002"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-03-26T12:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-03-26T12:30:00Z"
 * 
 * /comments:
 *   get:
 *     summary: Get all Comments 💬
 *     tags: [Comments]
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
 *           enum: [createdAt, star]
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
 *         name: text
 *         schema:
 *           type: string
 *         description: Filter by comment text (partial match)
 *       - in: query
 *         name: star
 *         schema:
 *           type: integer
 *         description: Filter by star rating
 *       - in: query
 *         name: edu_id
 *         schema:
 *           type: string
 *         description: Filter by EduCenter ID
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: string
 *         description: Filter by User ID
 *     responses:
 *       200:
 *         description: List of Comments retrieved successfully
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
 *                     $ref: '#/components/schemas/Comment'
 *       500:
 *         description: Server error
 */

router.get('/', getComments);


/**
 * @swagger
 * /comments/{id}:
 *   get:
 *     summary: Get a Comment by ID 🔍
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment details retrieved successfully
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */
router.get('/:id', getComment);

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create a new Comment ➕
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             text: "Great learning center!"
 *             star: 5
 *             edu_id: "550e8400-e29b-41d4-a716-446655440001"
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Server error
 */
router.post('/',roleMiddleware(["admin", "superadmin", "user", "ceo"]), createComment);

/**
 * @swagger
 * /comments/{id}:
 *   patch:
 *     summary: Update a Comment ✏️
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             text: "Updated: Really great learning center!"
 *             star: 4
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */
router.patch('/:id',roleMiddleware(["admin", "superadmin", "user", "ceo"]), updateComment);

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete a Comment 🗑️
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */
router.delete('/:id',roleMiddleware(["admin", "superadmin", "user", "ceo"]), deleteComment);

module.exports = router;