import { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import {ApiResponse} from "../utils/ApiResponse.js"

const createCart = asyncHandler(async(req,res)=>{

    const cart = await Cart.create({
        customer:req.user._id
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200,cart,"cart create successfully")
    )
})

export const addProductinCart = asyncHandler(async(req,res)=>{
    
        const {cartId,productId} = req.params;
        const isValidProductId = isValidObjectId(productId);
        const isValidcartId = isValidObjectId(cartId);
    
        if(!isValidProductId){
            throw new ApiError(401,'productId is not valid');
        }
        if(!isValidcartId){
            throw new ApiError(401,'productId is not valid');
        }

        const product = await Product.findById(productId)
        if(!product) throw new ApiError(404,"product not found")
    
        const additeminCart = await Cart.findByIdAndUpdate(
            cartId,
            {
                $push:{cartitem:productId}
            },
            {
                new:true
            }
        )

        return res.status(200)
        .json(new ApiResponse(200,additeminCart,"add product in cart successfully"))
    

    
})

export const removeProductinCart = asyncHandler(async(req,res)=>{
    const {cartId,productId} = req.params;
        const isValidProductId = isValidObjectId(productId);
        const isValidcartId = isValidObjectId(cartId);
    
        if(!isValidProductId){
            throw new ApiError(401,'productId is not valid');
        }
        if(!isValidcartId){
            throw new ApiError(401,'productId is not valid');
        }

        const product = await Product.findById(productId)
        if(!product) throw new ApiError(404,"product not found")
    
        const removeiteminCart = await Cart.findByIdAndUpdate(
            cartId,
            {
                $pull:{cartitem:productId}
            },
            {
                new:true
            }
        )

        return res.status(200)
        .json(new ApiResponse(200,removeiteminCart,"remove product in cart successfully"))
    
})


export const userGetAllCartItems = asyncHandler(async(req,res)=>{
     
    const alluserCartProducts = await Cart.aggregate([
        {
            $match:{
                customer: new mongoose.Types.ObjectId(req.user?._id)
            }
        },
        {
            $lookup:{
                from:"products",
                localField:"productId",
                foreignField:"_id",
                as:"Product"
            }
        }
    ])
    
    return res
    .status(200)
    .json(
        new ApiResponse(200,alluserCartProducts,"get user cart successfully")
    )
})