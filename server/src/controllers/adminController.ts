import type{Request,Response} from 'express'
import User from '../models/userModel.js'

export const getAllUsers = async(req:Request,res:Response) =>{
   try{
     //Fetch all users from DB
     const users = await User.find();
     if(!users){
        return res.status(404).json({message:"No users found"})
     }
     res.status(200).json({users})
   }catch(err:any){
    res.status(500).json({message:"Failed to fetch users" + err.message})
   }
}