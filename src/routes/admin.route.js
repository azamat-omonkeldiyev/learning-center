const express = require("express");
const router = express.Router();
const adminController = require("../controller/admin.controller");
const roleMiddleware = require("../rolemiddleware/roleAuth");

/**
 * @swagger
 * components:
 *   schemas:
 *     Admin:
 *       type: object
 *       required:
 *         - fullname
 *         - phone
 *         - password
 *         - role
 *       properties:
 *         id:
 *           type: string
 *           description: Unikal Admin ID
 *         fullname:
 *           type: string
 *           description: Adminning to‘liq ismi
 *         phone:
 *           type: string
 *           description: Adminning telefon raqami
 *         password:
 *           type: string
 *           description: Admin paroli
 *         role:
 *           type: string
 *           enum: [admin, superadmin]
 *           description: Admin roli
 *       example:
 *         id: "550e8400-e29b-41d4-a716-446655440000"
 *         fullname: "John Doe"
 *         phone: "+998901234567"
 *         password: "securepassword"
 *         role: "admin"
 */

/**
 * @swagger
 * /admins:
 *   post:
 *     summary: Yangi admin yaratish
 *     tags: [Admins]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Admin'
 *     responses:
 *       201:
 *         description: Yangi admin yaratildi
 *       400:
 *         description: Yaroqsiz ma'lumot
 */
router.post("/",roleMiddleware(["admin"]), adminController.createAdmin);

/**
 * @swagger
 * /admins:
 *   get:
 *     summary: Barcha adminlarni olish
 *     tags: [Admins]
 *     responses:
 *       200:
 *         description: Adminlar ro‘yxati
 */
router.get("/",roleMiddleware(["admin"]), adminController.getAdmins);

/**
 * @swagger
 * /admins/{id}:
 *   get:
 *     summary: ID bo‘yicha adminni olish
 *     tags: [Admins]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Admin ID-si
 *     responses:
 *       200:
 *         description: Topilgan admin
 *       404:
 *         description: Admin topilmadi
 */
router.get("/:id",roleMiddleware(["admin"]), adminController.getAdminById);

/**
 * @swagger
 * /admins/{id}:
 *   patch:
 *     summary: Admin ma'lumotlarini yangilash
 *     tags: [Admins]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Admin ID-si
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Admin'
 *     responses:
 *       200:
 *         description: Admin yangilandi
 *       400:
 *         description: Yaroqsiz ma'lumot
 *       404:
 *         description: Admin topilmadi
 */
router.patch("/:id",roleMiddleware(["admin"]), adminController.updateAdmin);

/**
 * @swagger
 * /admins/{id}:
 *   delete:
 *     summary: Adminni o‘chirish
 *     tags: [Admins]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Admin ID-si
 *     responses:
 *       204:
 *         description: Admin o‘chirildi
 *       404:
 *         description: Admin topilmadi
 */
router.delete("/:id",roleMiddleware(["admin"]), adminController.deleteAdmin);

module.exports = router;
