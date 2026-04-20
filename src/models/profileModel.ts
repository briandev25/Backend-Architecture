import mongoose from 'mongoose';

const { Schema} = mongoose;

const profileSchema = new Schema({
   user:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true, //Each profile must be associated with a user
    unique:true //One-to-one relationship between user and profile
   },
   bio:String,
   avatarUrl:String,
   location:String,

},{timestamps:true})

const Profile = mongoose.model("Profile",profileSchema);

export default Profile;