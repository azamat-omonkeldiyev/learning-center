const express = require("express");
const upload = require("../multer/multer");
const api = express.Router();

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: File upload management
 */

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload a file
 *     tags: [Upload]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - rasm
 *             properties:
 *               rasm:
 *                 type: string
 *                 format: binary
 *                 description: File to upload
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   example: http://localhost:4000/image/example.jpg
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: Internal server error
 */
api.post("/", upload.single("rasm"), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ error: "No file uploaded" });
  }
  res.send({ url: `http://localhost:4000/image/${req.file.filename}` });
});

module.exports = api;
