const { Router } = require("express");
const Session = require("../models/session.model");
const User = require("../models/user.model");

const roleMiddleware = require("../rolemiddleware/roleAuth");

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Sessions
 *   description: API for managing user sessions
 */

/**
 * @swagger
 * /sessions:
 *   get:
 *     summary: Get session data for the authenticated user
 *     tags: [Sessions]
 *     responses:
 *       200:
 *         description: Returns session data for the authenticated user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   example:
 *                     id: 1
 *                     userId: 123
 *                     createdAt: "2024-03-18T12:00:00Z"
 *       401:
 *         description: Unauthorized, token required
 *       500:
 *         description: Internal server error
 */
router.get("/",roleMiddleware(["admin","superadmin","user","ceo"]), async (req, res) => {
    try {
        let data = await Session.findAll({where: {user_id: req.userId}});
        res.json({ data });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /sessions/{id}:
 *   delete:
 *     summary: Delete a session by ID
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Session ID to delete
 *     responses:
 *       200:
 *         description: Session deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deletedSession:
 *                   type: object
 *                   example:
 *                     id: 1
 *                     userId: 123
 *                     createdAt: "2024-03-18T12:00:00Z"
 *       403:
 *         description: User cannot delete another user who was created before them
 *       404:
 *         description: Session or user not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", roleMiddleware(["admin","superadmin","user","ceo"]), async (req, res) => {
    try {
        let session = await Session.findByPk(req.params.id);
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        };

        const deletedSession = { ...session.get() };
        await session.destroy();

        res.json({ deletedSession });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
