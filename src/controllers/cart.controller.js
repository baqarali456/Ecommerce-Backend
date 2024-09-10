import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Address } from "../models/address.model.js";

export const createCart = asyncHandler(async (req, res) => {
  const address = await Address.findOne({owner:req.user._id})
  if(!address){
    throw new ApiError(404,"address not found")
  }
  const cart = await Cart.create({
     customer:req.user._id,
    address:address._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "cart create successfully"));
});

const getCart = asyncHandler(async(req,res)=>{

  const cart = await Cart.findOne({customer:req.user._id})
  if(!cart){
    throw new ApiError(404,"cart not found")
  }
   return res
   .status(200)
   .json(
    new ApiResponse(200,getCart,"user get cart successfully")
   )
})

export const addProductinCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const isValidProductId = isValidObjectId(productId);

  if (!isValidProductId) {
    throw new ApiError(401, "productId is not valid");
  }

  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "product not found");

  const cart = await Cart.findOne({ customer: req.user._id });

  cart.cartitem.push({ productId: productId, quantity: 1 });

  await cart.save();

  const updateCart = await Cart.findOne({ customer: req.user._id });
  return res
    .status(200)
    .json(new ApiResponse(200, updateCart, "add product in cart successfully"));
});

// change quantity of product in Cart Controller

export const changeQuantity = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const { productId } = req.params;
  console.log(productId);

  const isValidproductId = isValidObjectId(productId);
  if (!isValidproductId) {
    throw new ApiError(401, "product id is not valid");
  }
  if (!quantity) throw new ApiError(401, "quantity is required");
  console.log(productId);

  /* get quantity from req.body
      get productId from params
      by help of productId get Product
   */

  const cart = await Cart.updateOne(
    { customer: req.user._id, "cartitem.productId": productId },
    {
      $set: {
        "cartitem.$.quantity": quantity,
      },
    },
    {
      new: true,
    }
  );
  // const index = cart.cartitem.findIndex(
  //   (product) => product.productId.toString() === productId
  // );
  // if (index === -1) throw new ApiError(401, "product index in -1");

  // cart.cartitem.splice(index, 1, { ...cart[index], productId, quantity });

  // await cart.save()

  // const newCart = await Cart.findOne({customer:req.user._id})

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "user change qunatity successfully"));
});

export const removeProductinCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const isValidproductId = isValidObjectId(productId);

  if (!isValidproductId) {
    throw new ApiError(401, "productId is not valid");
  }

  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "product not found");

  const cart = await Cart.findOne({ customer: req.user._id });

  let index = cart.cartitem.findIndex(
    (product) => product.productId.toString() === productId
  );

  if (index === -1) {
    throw new ApiError(401, "product  is not found in cartitem");
  }

  cart.cartitem.splice(index, 1);

  await cart.save();

  const updateCart = await Cart.findOne({ customer: req.user._id });

  return res
    .status(200)
    .json(
      new ApiResponse(200, updateCart, "remove product in cart successfully")
    );
});

export const userGetAllCartItems = asyncHandler(async (req, res) => {
  const alluserCartProducts = await Cart.aggregate([
    {
      $match: {
        customer: new mongoose.Types.ObjectId(req.user?._id),
      },
    },
    {
      $unwind: "$cartitem",
    },
    {
      $lookup: {
        from: "products",
        localField: "cartitem.productId",
        foreignField: "_id",
        as: "cartitem.productId",
        pipeline: [
          {
            $project: {
              name: 1,
              productImage: 1,
              description: 1,
              price: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$cartitem.productId",
    },
    {
      $addFields: {
        priceByQuantity: {
          $multiply: ["$cartitem.quantity", "$cartitem.productId.price"],
        },
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, alluserCartProducts, "get user cart successfully")
    );
});

export const getTotalPriceCart = async(userId) =>{
  const getTotalPrice =  await Cart.aggregate([
    {
      $match: {
        customer: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $unwind: "$cartitem",
    },
    {
      $lookup: {
        from: "products",
        localField: "cartitem.productId",
        foreignField: "_id",
        as: "cartitem.productId",
      },
    },
    {
      $unwind: "$cartitem.productId",
    },
    {
      $addFields: {
        priceByQuantity: {
          $multiply: ["$cartitem.quantity", "$cartitem.productId.price"],
        },
      },
    },
    {
      $group: {
        _id: null,
        TotalAmount: {
          $sum: "$priceByQuantity",
        },
      },
    },
    {
      $addFields: {
        TotalAmountOfCart: "$TotalAmount",
      },
    },
  ]);
  

  return getTotalPrice[0]

}

export const userGetTotalCartPrice = asyncHandler(async (req, res) => {
  
  const getuserCartPrice  = await getTotalPriceCart(req.user?._id)

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        getuserCartPrice,
        "get user Total Amount Of Products in Cart"
      )
    );
});
