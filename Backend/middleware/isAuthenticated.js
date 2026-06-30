import jwt from "jsonwebtoken"
import { User } from "../model/userModel.js"


export const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.id = decoded.userId || decoded.id;

    const user = await User.findById(req.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("Auth error:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
export const isAdmin =(req,res,next)=>{
  if(req.user && req.user.role=='admin'){
    next()
  }
  else{
    return res.status(403).json({
      message : "Access denied  : admins only "
    })
  }
}