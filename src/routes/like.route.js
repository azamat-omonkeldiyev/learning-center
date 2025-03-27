const express = require("express");
const { createLike, deleteLike } = require("../controller/like.controller");
const roleMiddleware = require("../rolemiddleware/roleAuth");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Likes
 *   description: Likes management for educational centers and branches
 */

/**
 * @swagger
 * /likes:
 *   post:
 *     summary: Add a like ❤️
 *     tags: [Likes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - edu_id
 *             properties:
 *               edu_id:
 *                 type: string
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *                 description: Educational center ID (optional, must provide either edu_id or branch_id)
 *     responses:
 *       201:
 *         description: Like added successfully
 *       400:
 *         description: Validation error (edu_id or branch_id must be provided)
 *       500:
 *         description: Server error
 */
router.post("/", roleMiddleware(["admin", "superadmin", "user", "ceo"]), createLike);

/**
 * @swagger
 * /likes/{id}:
 *   delete:
 *     summary: Remove a like ❌
 *     tags: [Likes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Like ID to delete
 *     responses:
 *       200:
 *         description: Like deleted successfully
 *       403:
 *         description: Unauthorized - Only the creator or admin can delete this like
 *       404:
 *         description: Like not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", roleMiddleware(["admin", "user","superadmin", "ceo"]), deleteLike);

module.exports = router;
