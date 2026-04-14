import express from 'express';
import type {Request,Response} from 'express'
import User from '../models/userModel.js';
import validateNewUser from '../schemas/userSchema.js';

const route = express.Router()

route.post('/register', async(req:Request,res:Response) =>{

     const result = validateNewUser.safeParse(req.body);
     if(!result.success){
          return res.status(400).json({error:result.error.flatten()})
     }
      const { username, email, password} =result.data   //Sanitized
     
     try{
       //Check if user exists
       let userExists = await User.findOne({ email});
       if(userExists){
          return res.status(400).json({message:"User already exists, try signing in"});
       }
       const newUser = new User({username,email,password});
       //Saving to DB
       await newUser.save();
       res.status(201).json({message:"User saved successfully"})

     }catch(err:any){
          res.status(500).json({message:err.message})
     }
})




export default route;