import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
export const adminMiddleware = asyncHandler(async(req,res,next)=>{
   const user =  await User.findById(req.user?._id)
   
   if(user.role === "user"){
    throw new ApiError(401,"unauthorized admin request")
   }
   next()
})