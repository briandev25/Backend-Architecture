import express from 'express';
import mongoose from 'mongoose'
import dotenv from 'dotenv';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';

import routes from './routes/index.js';
import { authenticateToken } from './middlewares/authMiddleware.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const swaggerOptions ={
    definition:{
        info:{
            title:"Backend Archetecture API",
            version:"1.0.0",
            description:"A simple Express API for backend archetecture project"
        }
    },
    apis:["./src/routes/*.ts"]
}

const swaggerDocs = swaggerJsDoc(swaggerOptions);


app.use(express.json());
app.use('/api/v1',routes);
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerDocs));


app.get("/", (req,res) =>{
    res.send("Welcome again")
});

mongoose.connect(process.env.MONGO_URI as string).then(() =>console.log("Connected to mongodb database...")).catch(err => console.log("MongoDB error: ",err))

app.listen(PORT,() => console.log(`Server listening to port ${PORT}`) )