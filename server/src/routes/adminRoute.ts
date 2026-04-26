import express from 'express';
import{getAllUsers} from '../controllers/adminController.js'

const route = express.Router();

route.get('/users',getAllUsers)

export default route;

