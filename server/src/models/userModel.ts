import mongoose,{ Document} from "mongoose";
import bcrypt from 'bcrypt'
import { passwordRegex } from "../utils/password.js";

const { Schema } = mongoose;

interface IUser extends Document{
  username: string;
  email: string;
  password: string;
  date?: Date;
} 
const userSchema = new Schema<IUser>({
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
        },
       
    },
    
    date:{
        type:Date,
        default:Date.now
    }
},{timestamps:true}
);

userSchema.pre("save", async function (this: IUser) {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});


const User = mongoose.model("User",userSchema);

export default User;