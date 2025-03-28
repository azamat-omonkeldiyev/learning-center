const express = require("express");
const {
  login,
  refresh,
  register,
  verify,
  sendOtp,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  me,
  resetPassword
} = require("./../controller/user.controller");
const roleMiddleware = require("../rolemiddleware/roleAuth");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - fullname
 *         - email
 *         - password
 *         - phone
 *         - role
 *         - region_id
 *       properties:
 *         fullname:
 *           type: string
 *           example: "John Doe"
 *         email:
 *           type: string
 *           example: "johndoe@example.com"
 *         password:
 *           type: string
 *           example: "securepassword"
 *         phone:
 *           type: string
 *           example: "+998901234567"
 *         image:
 *           type: string
 *           example: "https://example.com/image.jpg"
 *         role:
 *           type: string
 *           enum: ["admin", "user", "superadmin", "ceo"]
 *           example: "user"
 *         region_id:
 *           type: integer
 *           example: 1
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user 📝
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error or duplicate user
 */
router.post("/register", register);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a user 🔑
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullname
 *               - password
 *             properties:
 *               fullname:
 *                 type: string
 *                 example: "John Doe"
 *               password:
 *                 type: string
 *                 example: "securepassword"
 *               ip_id:
 *                 type: string
 *                 example: "123.11.00"
 *     responses:
 *       200:
 *         description: Login successful, returns access and refresh tokens
 *       400:
 *         description: Invalid username or password
 */
router.post("/login", login);

/**
 * @swagger
 * /users/send-otp:
 *   post:
 *     summary: Send OTP to user email or phone 📩
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - phone
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               phone:
 *                 type: string
 *                 example: "901234567"
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: Invalid email or phone number
 */
router.post("/send-otp", sendOtp);

/**
 * @swagger
 * /users/verify-otp:
 *   post:
 *     summary: Verify OTP code ✅
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verification result
 *       400:
 *         description: Invalid OTP or email
 */
router.post("/verify-otp", verify);

/**
 * @swagger
 * /users/refresh:
 *   post:
 *     summary: Refresh access token using refresh token 🔄
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refresh_token
 *             properties:
 *               refresh_token:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI..."
 *     responses:
 *       200:
 *         description: Returns a new access token
 *       400:
 *         description: Invalid or missing refresh token
 */
router.post("/refresh", refresh);

/**
 * @swagger
 * /users/me:
 *   post:
 *     summary: Get the current user's information 👤
 *     description: Retrieves the details of the currently authenticated user.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - my_ip
 *             properties:
 *               my_ip:
 *                 type: string
 *                 description: IP address of the user session
 *                 example: "192.168.1.1"
 *     responses:
 *       200:
 *         description: Successfully retrieved user data
 *       400:
 *         description: Bad request, missing my_ip field
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "My IP idni kiriting!"
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       404:
 *         description: Session mavjud emas
 *       500:
 *         description: Server error
 */

router.post("/me", roleMiddleware(["admin", "superadmin", "user", "ceo"]), me);


/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users with pagination and filtering 👥
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: region_id
 *         schema:
 *           type: string
 *         description: Filter users by region ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of results per page
 *       - in: query
 *         name: sortField
 *         schema:
 *           type: string
 *           enum: [fullname, createdAt]
 *           default: fullname
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
 *         description: List of users with pagination
 */
router.get("/",roleMiddleware(["admin", "superadmin"]), getUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID 🔍
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: User not found
 */
router.get("/:id",roleMiddleware(["admin", "superadmin", "user", "ceo"]), getUserById);

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Update a user ✏️
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "newemail@example.com"
 *               phone:
 *                 type: string
 *                 example: "+998901234567"
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: User not found
 */
router.patch("/:id",roleMiddleware(["admin", "superadmin", "user", "ceo"]), updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user 🗑️
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete("/:id",roleMiddleware(["admin", "user", "ceo"]), deleteUser);

/**
 * @swagger
 * /users/resetpassword:
 *   post:
 *     summary: Reset user password 🔑
 *     tags: [Reset password]
 *     description: Allows a user to reset their password. Requires authentication and specific roles (admin, user, ceo, or superadmin).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newpassword
 *             properties:
 *               newpassword:
 *                 type: string
 *                 description: The new password for the user (minimum 8 characters)
 *                 example: newSecurePassword123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password reset successfully
 *       400:
 *         description: Bad request (e.g., missing or invalid password)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Your password should be at least 8 characters long
 *       401:
 *         description: Unauthorized (e.g., invalid token or insufficient role)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
router.post("/resetpassword", roleMiddleware(["admin", "user", "ceo", "superadmin"]), resetPassword)

module.exports = router;