import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import { passwordRegex } from "../utils/password.js";

const { Schema } = mongoose;

const userSchema = new Schema({
    username:{
        type:String,
        unique:[true,"Username is already taken"],
        required:[true, "Please enter username"],
        minlength:[5,"Username is too short"],
        maxlength:[32, "Maximum characters reached!!!"],
        trim:true
    },
    email:{
        type:String,
        unique:[true,"Email is already taken"],
        required:[true,"Please enter email"],
        lowercase:true,
        trim:true,
        match:[/^\S+@\S+\.\S+$/,"Please enter a valid email address"]
    },
    password:{
        type:String,
        required:[true,"Please enter password"],
        minlength:6,
        validate:{
            validator:(value:string) => passwordRegex.test(value),
            message: "Password must include uppercase, lowercase, and a number"
        }
    },
    
    date:{
        type:Date,
        default:Date.now
    }
});

userSchema.pre('save', async function(next){
   //We only hash if password is new or modified
    if(!this.isModified("password")){
     return next();
   }

    try{
   this.password = await bcrypt.hash(this.password,10);
  }catch(err){
    next(err as Error)
  }
})

const User = mongoose.model("User",userSchema);

export default User;