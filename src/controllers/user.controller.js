import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateAccessandRefreshToken = async(userId) =>{
 try {
    const user = await User.findById(user._id)
    const accessToken = user.generateAccessToken()
    const newrefreshToken = user.generateRefreshToken()
    user.refreshToken = newrefreshToken
    await user.save({validateBeforeSave:false})
    return {accessToken,refreshToken}
 } catch (error) {
    throw new ApiError(500,"something went wrong while generating  access and Refresh Token")
 }
}

const registerUser = asyncHandler(async(req,res)=>{
    console.log(req)
    // get details from frontend by postman
    // validate details
    // check user already exists or not
    // if user not already registered then user create 
    // send through response
    
    const {username,email,password,phoneNumber} = req.body;
    if([username,email,password,phoneNumber].some(fields=>fields?.trim() === "")){
      throw new ApiError(401,"all fields are required")  
    }
    
   const existingUser = await User.findOne({
        $or:[{username},{email}]
    })

    if(existingUser){
        throw new ApiError(401,"user already registered")
    }
    
   const RegisteredUser = await User.create({
        username,
        email,
        password,
        phoneNumber
    })

    if(!RegisteredUser){
        throw new ApiError(500,"something went wrong while create user")
    }


    return res
    .status(200)
    .json(
        new ApiResponse(200,RegisteredUser,"user successfully registered")
    )

})

const logInUser = asyncHandler(async(req,res)=>{
    const {username,email,password} = req.body;
    if(!username?.trim() && !email?.trim()){
        throw new ApiError(400,"username or email is required")
    }

   const user = await User.findOne({
      $or:[{username},{email}]
    })

    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid) throw new ApiError(400,"password is wrong")

      const {accessToken,refreshToken} = await generateAccessandRefreshToken(user._id)
    

    const options = {
        httpOnly:true,
        secure:true
    }

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
 
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(200,{user:loggedInUser,accessToken,refreshToken},"user login successfully")
    )

})

const logoutUser = asyncHandler(async(req,res)=>{
     await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{
                refreshToken:1,
            }
        },
        {
            new : true,
        }
     )

     return res
     .status(200)
     .json(
        new ApiResponse(200,{},"user logout successfully")
     )


})

const refresh_RefreshToken = asyncHandler(async(req,res)=>{
    const incomingTOKEN = req.cookies?.refreshToken || req.body.refreshToken

   const decodedInfo = jwt.verify(incomingTOKEN,process.env.REFRESH_TOKEN_SECRET)
   
   try {
     const user = await User.findById(decodedInfo._id)
     if(!user){
        throw new ApiError(400,"invalid refreshToken")
     }
     if(incomingTOKEN !== user.refreshToken){
        throw new ApiError(401,"refreshToken didn't match with user refreshToken")
     }

     const {accessToken,refreshToken} = await generateAccessandRefreshToken(user._id)
  
     const options = {
        httpOnly:true,
        secure:true
    }

 
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(200,{user:loggedInUser,accessToken,refreshToken})
    )

   } catch (error) {
     throw new ApiError(500,error || "something went wrong while  Refreshing refreshToken ")
   }
})

const changePassword = asyncHandler(async(req,res)=>{
    const {oldPassword,newPassword} = req.body;
    if(!oldPassword?.trim() || !newPassword?.trim()){
        throw new ApiError(400,"password fields are required")
    }
    try {
       const user = await User.findById(req.user?._id);
       const isValidPassword = await user.isPasswordCorrect(oldPassword)
       if(!isValidPassword){
        throw new ApiError(401,"oldPassword is wrong")
       }
       user.password = newPassword
       await user.save({validateBeforeSave:false})

       return res
       .status(200)
       .json(
        new ApiResponse(200,{},"user change Passsword Successfully")
       )
    } catch (error) {
        throw new ApiError(500,error || "something went wrong while user change Password")
    }
})
const changeUserDetails = asyncHandler(async(req,res)=>{
    const {username,email,phoneNumber} = req.body;
    if(!username?.trim() || !email?.trim() || !phoneNumber?.trim()){
        throw new ApiError(400,"all fields are required")
    }
    try {
       const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                username,
                email,
                phoneNumber
            }
        },
        {
            new : true
        }
       ).select(" -password -refreshToken")

       return res
       .status(200)
       .json(
        new ApiResponse(200,user,"user change Passsword Successfully")
       )
    } catch (error) {
        throw new ApiError(500,error || "something went wrong while user change Password")
    }
})

const getUserProfile = asyncHandler(async(req,res)=>{
    const userProfile = await User.findById(req.user._id,{email:1,username:1,phoneNumber:1})

    return res
    .status(200)
    .json(
        new ApiResponse(200,userProfile,"successfully get user Profile")
    );
})



export {
    registerUser,
    logInUser,
    logoutUser,
    refresh_RefreshToken,
    changePassword,
    changeUserDetails,
    getUserProfile
}