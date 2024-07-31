import { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import {ApiResponse} from "../utils/ApiResponse.js"

export const addProductinCart = asyncHandler(async(req,res)=>{
    try {
        const {productId} = req.params;
        const isValidProductId = isValidObjectId(productId);
    
        if(!isValidProductId){
            throw new ApiError(401,'productId is not valid');
        }

        const product = await Product.findById(productId)
        if(!product) throw new ApiError(404,"product not found")
    
        const additeminCart = await Cart.create({
           cartitem:[
            {
                productId,
            }
           ],
           customer:req.user._id,
        })

        return res.status(200)
        .json(new ApiResponse(200,additeminCart,"add product in cart successfully"))
    } catch (error) {
        throw new ApiError(500,error || "Server Problem")
    }

    
})

export const removeProductinCart = asyncHandler(async(req,res)=>{
    const {cartId} = req.params;
    
    const isValidCartId = isValidObjectId(cartId)

    if(!isValidCartId) throw new ApiError(401,"cart id is not valid")

      const deletedCart = await Cart.deleteOne({_id:cartId})
      if(!deletedCart) throw new ApiError(401,"this cart item does not exist")

    return res.status(200)
    .json(
        new ApiResponse(200,deletedCart,"successfully deleted this cart")
    )

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