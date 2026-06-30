import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
firstName : { type : String , required :true},
lastName : { type : String , required :true},
profilePic : {type: String , default :" "},
profilePicPublicId : {type:String , default :" "},
email :{type : String , required:true , unique : true},
password:{type : String , required:true },
role : {
    type : String,
    enum : ["user" , "admin"],
    default : "user"
},
token : { type : String , default : null},
isVerified : { type : String , default : false},
isLoggedIn : { type : String , default : false},
otp : { type : String , default : null},
otpExpiry : { type : Date , default : null},
city : {type : String , default : null},
address : { type : String },
zipCode : { type : String },
phoneNo: {type : String} ,
} , {timestamps : true})

export const User = mongoose.model("User" , userSchema)
