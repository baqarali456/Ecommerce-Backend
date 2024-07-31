import { Product } from "../models/product.model.js";
import { Wishlist } from "../models/wishlist.model.js";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose,{isValidObjectId} from "mongoose";

export const addProductinWishlist = asyncHandler(async(req,res)=>{
    const {productId,WishlistId} = req.params;
    const isValidproductId = isValidObjectId(productId);
    const isValidWishlistId = isValidObjectId(WishlistId);
    if(!isValidproductId || !isValidWishlistId){
        throw new ApiError(401,"productid or isValidWishlistId  is not valid")
    }

    const product = await Product.findById(productId)
   if(!product){
    throw new ApiError(404,"product does not exist")
   }

    const favouriteProducts = await Wishlist.findByIdAndUpdate(
        WishlistId,
        {
            $push:{favourites:productId}
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200,favouriteProducts,"successfully add product in wishlist")
    )

})

export const deletedProductinWishlist = asyncHandler(async(req,res)=>{
    const {productId,WishlistId} = req.params;
    const isValidproductId = isValidObjectId(productId);
    const isValidWishlistId = isValidObjectId(WishlistId);
    if(!isValidproductId || !isValidWishlistId){
        throw new ApiError(401,"productid or isValidWishlistId  is not valid")
    }

   const product = await Product.findById(productId)
   if(!product){
    throw new ApiError(404,"product does not exist")
   }

   const userdeleteProductinWishlist = await Wishlist.findByIdAndUpdate(
    WishlistId,
    {
        $pull:{favourites:productId}
    }
   )

   return  res
   .status(200)
   .json(
    new ApiResponse(200,userdeleteProductinWishlist,"successfully delete Products")
   )

})

export const getAllProductsinWishlist = asyncHandler(async(req,res)=>{
    const getUserFavouritesProducts = await Wishlist.aggregate([
        {
            $match:{
                owner:new mongoose.Types.ObjectId(req.user?._id)
            }
        },
        {
            $lookup:{
                from:"products",
                localField:"favourites",
                foreignField:"_id",
                as:"favourites"
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(200,getUserFavouritesProducts,"successfully get user wishlist products")
    )
})