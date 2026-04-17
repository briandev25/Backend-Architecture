import type {Request,Response} from 'express'
import User from '../models/userModel.js';
import { validateNewUser,validateLogin} from '../schemas/userSchema.js'
import { sendUserEmail } from '../utils/email.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export const newUserController = async(req:Request,res:Response) =>{

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
           //Send welcome email
           await sendUserEmail(email,`Welcome ${username}`,"Thank you for registering with our service! We're excited to have you on board. If you have any questions or need assistance, feel free to reach out to our support team. Welcome to the community!")
       res.status(201).json({message:"User saved successfully"})

     }catch(err:any){
          res.status(500).json({message:err.message})
     }
}

export const loginUserController = async(req:Request,res:Response) =>{
     const results = validateLogin.safeParse(req.body);
     if(!results.success){
          return res.status(400).json({error:results.error.flatten()})
     }
    const { email,password } = results.data;
    try{
      const userExists = await User.findOne({email});
      if(!userExists){
        return res.status(400).json({message:"Username or password is incorrect(no email)"});
      }
     const isPasswordCorrect = await bcrypt.compare(password,userExists.password);
     if(!isPasswordCorrect){
       return res.status(400).json({message:"Username or password is incorrect(wrong password)"});
     }
     const token = jwt.sign({id:userExists._id},process.env.ACCESS_TOKEN_SECRET as string);
     res.status(201).json({accessToken:token,message:"User logged in successfully"});
    }catch(err:any){
        res.status(500).json({message:err.message})
    }
}