import express from 'express';
import { newUserController,loginUserController } from '../controllers/userController.js';



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

route.post('/login',loginUserController)




export default route;