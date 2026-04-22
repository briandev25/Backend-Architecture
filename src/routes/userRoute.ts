import express from 'express';
import { 
newUserController,
loginUserController,
forgotPasswordController,
resetPasswordController,
addProfileController,
getProfileController,
deleteUserController
 } from '../controllers/userController.js';
import{ forgotPasswordLimiter,resetPasswordLimiter } from '../middlewares/rateLimiter.js'
import { authenticateToken} from '../middlewares/authMiddleware.js'



const route = express.Router()

/**
 * @swagger
 * /api/v1/user/register:
 *   post:
 *     summary: Create a new user
 *     description: Adds a new user to the database
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: john_doe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: strongpassword123
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: User already exist or bad request
 */
route.post('/register',newUserController);


/**
 * @swagger
 * /api/v1/user/login:
 *   post:
 *     summary: Login user
 *     description: Authenticates user with email and password
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: strongpassword123
 *     responses:
 *       201:
 *         description: Login successful
 *         content:
 *           application/json:
 *       400:
 *         description: Invalid email or password
 */

route.post('/login',loginUserController);


/**
 * @swagger
 * /api/v1/user/forgot-password:
 *   post:
 *     summary: Request password reset
 *     description: Sends a password reset link to the user's email
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *     responses:
 *       200:
 *         description: Password reset link sent successfully
 *       400:
 *         description: Invalid email
 */
route.post('/forgot-password',forgotPasswordLimiter,forgotPasswordController);


/**
 * @swagger
 * /api/v1/user/reset-password:
 *   post:
 *     summary: Reset user password
 *     description: Allows user to reset their password using a reset token
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *                 example: newstrongpassword123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid or expired reset token
 */
route.post('/reset-password',resetPasswordLimiter,resetPasswordController);

/**
 * @swagger
 * /api/v1/user/profile:
 *   post:
 *     summary: Add user profile
 *     description: Adds a new profile for the logged-in user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bio
 *               - avatarUrl
 *               - location
 *             properties:
 *               bio:
 *                 type: string
 *                 example: Software developer passionate about creating innovative solutions.
 *               avatarUrl:
 *                 type: string
 *                 example: https://example.com/avatar.jpg
 *               location:
 *                 type: string
 *                 example: New York, USA
 *     responses:
 *       201:
 *         description: Profile added successfully
 *       400:
 *         description: Bad request
 */
route.post('/profile',authenticateToken,addProfileController);


/** * @swagger
 * /api/v1/user/profile:
 *   get:
 *     summary: Get user profile
 *     description: Retrieves the profile information for the logged-in user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *       400:
 *         description: Profile not found for this user
 */

route.get('/profile',authenticateToken,getProfileController);


/**
 * @swagger
 * /api/v1/user/delete:
 *   delete:
 *     summary: Delete user account
 *     description: Deletes the logged-in user's account
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
route.delete('/delete',authenticateToken,deleteUserController);


export default route;