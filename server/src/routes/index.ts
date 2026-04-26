import express from 'express';

import userRoute from './userRoute.js'
import adminRoute from './adminRoute.js';

const route = express.Router()


route.use('/user',userRoute);
route.use('/admin',adminRoute);



export default route;