import { Router } from "express";
import { addProductinWishlist, createUserWishlist, getUserallProductsinWishlist, removeProductinWishlist } from "../controllers/wishlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

export const wishlistRouter = Router();

wishlistRouter.route('/create-wishlist').post(verifyJWT,createUserWishlist)
wishlistRouter.route('/addproductinWishlist/:productId/:wishlistId').patch(verifyJWT,addProductinWishlist)
wishlistRouter.route('/removeproductinWishlist/:productId/:wishlistId').patch(verifyJWT,removeProductinWishlist)
wishlistRouter.route('/getuserwishlist/:wishlistId').get(verifyJWT,getUserallProductsinWishlist)

