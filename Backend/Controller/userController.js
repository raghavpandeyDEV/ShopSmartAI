import { User } from "../model/userModel.js"
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import { verifyEmail } from "../VerifyEmail/verifyEmail.js"
import { Session } from "../model/sessionModel.js"
import { sendOTPMail } from "../VerifyEmail/sendOTPMail.js"
import cloudinary from '../utils/cloudinary.js'


export const registerUser = async (req, res) => {
  try {

    const { firstName, lastName, email, password } = req.body

  
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      })
    }

   
    const user = await User.findOne({ email })

    if (user) {
      return res.status(400).json({
        message: "User already exists"
      })
    }

   const hashedPassword= await bcrypt.hash(password,10)
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password:hashedPassword
    })

    const token=jwt.sign({id:newUser._id},process.env.SECRET_KEY , { expiresIn: '10m' } )
    newUser.token=token
    verifyEmail(token , email )
    await newUser.save()
    return res.status(201).json({
      message: "User Created successfully",
      user: newUser,
      success:true
    })

  } catch (error) {

    console.log(error)
    return res.status(500).json({
      message: "Internal Server Error"
    })
  }
}

 export const verifyUser= async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    // Check header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({
        success: false,
        message: "Authorization token is missing or invalid",
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(400).json({
          success: false,
          message: "The registration token has expired",
        });
      }

      return res.status(400).json({
        success: false,
        message: "Token verification failed",
      });
    }

    // Find user
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // Update user
    user.token = null;
    user.isVerified = true;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const loginUser= async(req,res)=>{
  try{
  const{email , password}=req.body;
  if(!email || !password){
    return res.status(400).json({
      message:"Both email and password are required"
    })
  }
  const existingUser=await User.findOne({email})
  if(!existingUser){
     return res.status(400).json({
      message:"User doesn't Exist"
    })
  }
  const isPasswordValid=await bcrypt.compare(password,existingUser.password)
  if(!isPasswordValid){
     return res.status(400).json({
      message:"Incorrect Password"
    })
  }
  if(existingUser.isVerified===false){
    return res.status(400).json({
      message : "Verify Your Account first"
    })
  }

  //generate Token
  const accessToken=jwt.sign({id:existingUser._id} , process.env.SECRET_KEY , { expiresIn : '10d'})
  const refreshToken=jwt.sign({id:existingUser._id} , process.env.SECRET_KEY , { expiresIn : '30d'})
  
  existingUser.isLoggedIn=true;
  await existingUser.save();

  //Check for existing session and Delete it
  const existingSession=await Session.findOne({userId:existingUser._id})
  if(existingSession){
    await Session.deleteOne({userId : existingUser._id})
  }

  //create a new Session
  await Session.create({userId:existingUser._id})
  return res.status(200).json({
    success:true,
    message:`Welcome back ${existingUser.firstName}`,
    user:existingUser,
    accessToken,
    refreshToken
  })

  }
  catch(error){
    return res.status(500).json({message:error.message})
  }
}
export const logoutUser = async(req,res)=>{
  try{
   const userId=req.user._id
   await Session.deleteMany({userId:userId})
   await User.findByIdAndUpdate(userId , {isLoggedIn:false})
   res.status(200).json({
    success:true,
    message:"User logged out successfully"
   })
  }
  
  catch(error){
    return res.status(500).json({message : error.message })
  }
}

export const forgotPassword=async(req,res)=>{
  try {
    const{email}=req.body;
    const user=await User.findOne({email})
    if(!user){
      return res.status(400).json({message: "User does not exist"})
    }
    const otp=Math.floor(100000+Math.random()*900000).toString()
    const otpExpiry=new Date(Date.now()+10*60*1000)
    user.otp=otp
    user.otpExpiry=otpExpiry

    await user.save();
    await sendOTPMail(otp , email);
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:error.message
    })
  }
}

export const changePassword=async(req,res)=>{
try {
  const {newPassword , confirmPassword}=req.body;
  const {email} = req.params;
  const user=await User.findOne({email})
  
  if(!user){
    return res.status(400).json({
      success:false,
      message:"User not found"
    })
  }
   if(!newPassword || !confirmPassword){
    return res.status(401).json({
      success:false,
      message:"Please enter all fields"
    })
  }

  if(newPassword!=confirmPassword){
    return res.status(400).json({
      success:false,
      message:"Passwords do not match"
    })
  }
  const hashedPassword=await bcrypt.hash(newPassword,10);
  user.password=hashedPassword
  await user.save()
  return res.status(200).json({
    success:true,
    message:"Password changed successfully"
  })
} catch (error) {
  return res.status(500).json({
    success:false,
    message:"Some error occured while changing password"
  })
}
}

export const allUser = async(_,res)=>{
try {
  const users = await User.find()
  return res.status(200).json({
    success:true,
    users
  })
} catch (error) {
  return res.status(500).json({
    success:false,
    message:error.message 
  })
}
}

export const getUserById=async(req,res)=>{
  try {
    const {userId} = req.params;
    const user = await User.findById(userId).select("-password -otp -otpExpiry -token")

    if(!user){
      return res.status(404).json({
        success:false,
        message:"User not found"
      })
    }
    return res.status(200).json({
      success:true,
      user
    })
  } 
  catch (error) {
    return res.status(500).json({
      success:false,
      message : error.message
    })
  }
}
export const updateUser = async (req, res) => {
  try {
    const userIdToUpdate = req.params.id;
    const loggedInUser = req.user;

    const { firstName, lastName, address, city, zipCode, phoneNo, role } = req.body;

    if (
      loggedInUser._id.toString() !== userIdToUpdate &&
      loggedInUser.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this profile",
      });
    }

    
    const user = await User.findById(userIdToUpdate);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found !!",
      });
    }

   if (req.body.profilePic) {
  user.profilePic = req.body.profilePic;
}
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.address = address || user.address;
    user.city = city || user.city;
    user.zipCode = zipCode || user.zipCode;
    user.phoneNo = phoneNo || user.phoneNo;
    user.role = role || user.role;

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    console.error("UPDATE USER ERROR:", error);
    console.log("CLOUD:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("KEY:", process.env.CLOUDINARY_API_KEY);
console.log("SECRET:", process.env.CLOUDINARY_API_SECRET);


    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};