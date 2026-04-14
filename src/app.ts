import express from 'express';
import mongoose from 'mongoose'
import dotenv from 'dotenv';

import routes from './routes/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/v1',routes);


app.get("/", (req,res) =>{
    res.send("Welcome again")
});

mongoose.connect(process.env.MONGO_URI as string).then(() =>console.log("Connected to mongodb database...")).catch(err => console.log("MongoDB error: ",err))

app.listen(PORT,() => console.log(`Server listening to port ${PORT}`) )