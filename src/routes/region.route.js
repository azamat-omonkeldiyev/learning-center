const express = require("express");
const { createRegion, getAllRegions, getRegionById, updateRegion, deleteRegion } = require("../controller/region.controller");
const roleMiddleware = require("../rolemiddleware/roleAuth");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Regions
 *   description: Region management APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Region:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Tashkent"
 *
 * tags:
 *   - name: Regions
 *     description: API endpoints for managing regions
 */

/**
 * @swagger
 * /regions:
 *   post:
 *     summary: Create a new region ➕
 *     tags: [Regions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Region'
 *     responses:
 *       201:
 *         description: Region created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Region'
 *       400:
 *         description: Invalid request data
 */
router.post("/",roleMiddleware(["admin"]), createRegion);

/**
 * @swagger
 * /regions:
 *   get:
 *     summary: Get all regions 🌍
 *     tags: [Regions]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: "Page number (default: 1)"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: "Number of records per page (default: 10)"
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
 *     responses:
 *       200:
 *         description: List of regions
 */
router.get("/",roleMiddleware(["admin", "superadmin", "user", "ceo"]), getAllRegions);

/**
 * @swagger
 * /regions/{id}:
 *   get:
 *     summary: Get region by ID 🔍
 *     tags: [Regions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Region ID
 *     responses:
 *       200:
 *         description: Region data
 *       404:
 *         description: Region not found
 */
router.get("/:id",roleMiddleware(["admin", "superadmin", "user", "ceo"]), getRegionById);

/**
 * @swagger
 * /regions/{id}:
 *   patch:
 *     summary: Update a region ✏️
 *     tags: [Regions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Region ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Samarkand"
 *     responses:
 *       200:
 *         description: Region updated
 *       404:
 *         description: Region not found
 */
router.patch("/:id", roleMiddleware(["admin", "superadmin"]), updateRegion);

/**
 * @swagger
 * /regions/{id}:
 *   delete:
 *     summary: Delete a region 🗑️
 *     tags: [Regions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Region ID
 *     responses:
 *       200:
 *         description: Region deleted successfully
 *       404:
 *         description: Region not found
 */
router.delete("/:id", roleMiddleware(["admin"]), deleteRegion);

module.exports = router;