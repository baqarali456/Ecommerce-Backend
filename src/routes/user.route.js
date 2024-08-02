import { Router } from "express";
import {  changePassword, getCurrentUser,    logInUser, logoutUser, refresh_RefreshToken, registerUser,  } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route('/register').post(registerUser)
userRouter.route('/login').post(logInUser)
userRouter.route('/logout').post(verifyJWT,logoutUser)
userRouter.route('/change-password').post(verifyJWT,changePassword)
userRouter.route('/user-Profile').get(verifyJWT,getCurrentUser)
userRouter.route('/refresh-RefreshToken').post(refresh_RefreshToken)



export {userRouter}