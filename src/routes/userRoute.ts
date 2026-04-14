import express from 'express';
import { newUserController } from '../controllers/userController.js';



const route = express.Router()

route.post('/register',newUserController )




export default route;