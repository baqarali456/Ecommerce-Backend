import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { User } from "../models/user.model";


const verifyJWT = asyncHandler(async(req,res,next)=>{
  try {
    const token = req.cookies?.accessToken || req.header("Authorization").slice(7)
  
    const decodedTokenInfo = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    if(!decodedTokenInfo){
      throw new ApiError(401,"token is required")
    }
    console.log(decodedTokenInfo)
  
    const user = await User.findById(decodedTokenInfo._id);
    if(!user){
      throw new ApiError(404,"unauthorized request")
    }
    req.user = user;
    next()
  } catch (error) {
    throw new ApiError(500,error.message || "something went wrong in verifyJWT")
  }
})


export {verifyJWT}