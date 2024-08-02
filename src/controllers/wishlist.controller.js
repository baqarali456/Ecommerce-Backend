import mongoose, { isValidObjectId } from "mongoose";
import { Wishlist } from "../models/wishlist.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Product } from "../models/product.model.js";

export const createUserWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.create({
    owner: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, wishlist, "successfully create wishlist"));
});

export const addProductinWishlist = asyncHandler(async (req, res) => {
  const { wishlistId, productId } = req.params;
  const validwishlistId = isValidObjectId(wishlistId);
  const validproductId = isValidObjectId(productId);

  if (!validproductId) throw new ApiError(401, "product id is not valid");
  if (!validwishlistId) throw new ApiError(401, "wishlist id is not valid");

  const product = await Product.findById(productId);
  if (!product) throw new ApiError(401, "product doesn't exist");

  const updatedUserwishlist = await Wishlist.findByIdAndUpdate(
    wishlistId,
    {
      $push: { favourites: productId },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUserwishlist, "add product in wishlist"));
});

export const removeProductinWishlist = asyncHandler(async (req, res) => {
  const { wishlistId, productId } = req.params;
  const validwishlistId = isValidObjectId(wishlistId);
  const validproductId = isValidObjectId(productId);

  if (!validproductId) throw new ApiError(401, "product id is not valid");
  if (!validwishlistId) throw new ApiError(401, "wishlist id is not valid");

  const product = await Product.findById(productId);
  if (!product) throw new ApiError(401, "product doesn't exist");

  const updatedUserwishlist = await Wishlist.findByIdAndUpdate(
    wishlistId,
    {
     $pull:{favourites:productId}
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUserwishlist, "add product in wishlist"));
});

export const getUserallProductsinWishlist = asyncHandler(async (req, res) => {
  const { wishlistId } = req.params;
  const validwishlistId = isValidObjectId(wishlistId);

  if (!validwishlistId) throw new ApiError(401, "wishlist id is not valid");

  const userWishlist = await Wishlist.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(wishlistId),
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "favourites",
        foreignField: "_id",
        as: "favourites",
        pipeline: [
          {
            $project: {
              name: 1,
              price: 1,
              productImage: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        NumberofProductsinWishlist: {
          $size: "$favourites",
        },
      },
    },
    {
      $project: {
        owner: 1,
        favourites: 1,
        NumberofProductsinWishlist: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, userWishlist, "get user wishlist successfully"));
});
