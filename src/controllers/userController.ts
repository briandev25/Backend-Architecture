import type {Request,Response} from 'express'
import User from '../models/userModel.js';
import { validateNewUser,validateLogin, validateProfileUpdate} from '../schemas/userSchema.js'
import { sendUserEmail } from '../utils/sendEmail.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Profile from '../models/profileModel.js';


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
       const payload ={id:newUser._id,username,email}
       const token = jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET as string);
       res.status(201).json({message:"User saved successfully", accessToken:token})
           //Send welcome email
       await sendUserEmail(email,`Welcome ${username}`,"Thank you for registering with our service! We're excited to have you on board. If you have any questions or need assistance, feel free to reach out to our support team. Welcome to the community!");   

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

     //Creating JWT and storing in cookie
     const payload = {id:userExists._id,username:userExists.username,email};
     const token = jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET as string,{expiresIn:'1hr'});

     res.cookie("token",token,{
      httpOnly:true,
      maxAge:3600000, //1hr
     })

     res.status(201).json({accessToken:token,message:"User logged in successfully"});
    }catch(err:any){
        res.status(500).json({message:err.message})
    }
}

export const logoutUserController = (req:Request,res:Response) =>{
  res.clearCookie("token");
  res.status(200).json({message:"User logged out successfully"});
}

export const addProfileController = async(req:Request,res:Response) =>{
  const results = validateProfileUpdate.safeParse(req.body);
  if(!results.success){
    return res.status(400).json({error:results.error.flatten()})
  }
  const { bio, avatarUrl, location} = results.data;
  try{
    const user = await User.findById(req.user.id);
    if(!user) {
      return res.status(404).json({message:"Logged in user not found(means token is valid but user does not exist)"})
    }
    const userProfile = new Profile({
      user:req.user.id,
      bio,
      avatarUrl,
      location
    });
    await userProfile.save();
    res.status(201).json({message:"Profile added successfully",profile:userProfile})
  }catch(err:any){
    res.status(500).json({message:"Error adding profile: " + err.message})
  }
}

export const getProfileController = async(req:Request,res:Response) =>{
  try{
      const profile = await Profile.findOne({user:req.user.id}).populate('user','username email -_id');
      if(!profile){
        return res.status(400).json({message:"Profile not found for this user"})
      }
      res.status(200).json({message:"Profile found", profile});

  }catch(err:any){
    res.status(500).json({message:"Could not get user profile:"+ err.message})
  }
}

export const forgotPasswordController = async(req:Request,res:Response) =>{
   const { email} = req.body;
   try{
      const userExists = await User.findOne({email});
      if(!userExists){
          return res.status(400).json({message:"User with this email does not exist"});
      }
          const resetToken = jwt.sign({id:userExists._id},process.env.ACCESS_TOKEN_SECRET as string,{expiresIn:'1h'});
          const resetLink = `${process.env.FRONTEND_URL}/api/v1/user/reset-password?token=${resetToken}`;
          await sendUserEmail(email,"Password Reset Request",`You requested a password reset. Click the link below to reset your password:\n\n${resetLink}\n\nIf you did not request this, please ignore this email.`)
          res.status(200).json({message:"Password reset email sent successfully",resetToken})
   }catch(err:any){
     res.status(500).json({message:err.message})
   }
}

export const resetPasswordController = async(req:Request,res:Response) =>{
  const { newPassword }  = req.body;
  const{ token } = req.query;
  if(typeof token !== 'string'){
    return res.status(400).json({message:"Invalid token(token missing or not a string)"})
  }
  if(!newPassword || typeof newPassword !== 'string' || newPassword.length < 6){
    return res.status(400).json({message:"Invalid new password"})
  }
  try{
    const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET as string) as {id:string};
    const userExists = await User.findById(decoded.id);
    if(!userExists){
      return res.status(400).json({message:"Invalid token(user not found)"});
    }
    userExists.password = newPassword;
    await userExists.save();
    res.status(200).json({message:"Password reset successfully"});
  }catch(err:any){
    res.status(500).json({message:"Error resetting password: "+err.message})
  }
}


export const deleteUserController = async(req:Request,res:Response) =>{
  try{
    const user = await User.findByIdAndDelete(req.user.id);
    if(!user){
      return res.status(404).json({message:"Logged in user not found(means token is valid but user does not exist)"})
    }
    res.status(200).json({message:"User deleted successfully",user});

  }catch(err:any){
    res.status(500).json({message:"Error deleting user: "+err.message})
  }
}