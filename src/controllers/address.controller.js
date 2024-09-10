import { Address } from "../models/address.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose, { isValidObjectId } from "mongoose";

const add_Address = asyncHandler(async (req, res) => {
  const { city, state, pincode, landmark, street, fullName, phoneNumber } =
    req.body;
  if (
    [city, state, pincode, landmark, street, fullName, phoneNumber].some(
      (fields) => fields.trim() === ""
    )
  ) {
    throw new ApiError(401, "all fields are required");
  }

  try {
    const addUserAddress = await Address.create({
      city,
      state,
      pincode,
      landmark,
      street,
      fullName,
      phoneNumber,
      owner: req.user._id,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, addUserAddress, "user add address successFully")
      );
  } catch (error) {
    throw new ApiError(
      500,
      error.message || "something went wrong while add Address"
    );
  }
});

const updateAddressById = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  const { city, state, pincode, landmark, street, fullName, phoneNumber } =
    req.body;
  if (
    [city, state, pincode, landmark, street].some(
      (fields) => fields.trim() === ""
    )
  ) {
    throw new ApiError(401, "all fields are required");
  }
  const isValidaddressId = isValidObjectId(addressId);
  if (!isValidaddressId) {
    throw new ApiError(401, "addressId is not valid");
  }
  try {
    const updatedAddress = await Address.findByIdAndUpdate(
      addressId,
      {
        $set: {
          city,
          state,
          pincode,
          landmark,
          street,
          fullName,
          phoneNumber,
        },
      },
      {
        new: true,
      }
    );
    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedAddress, "user update address successfully")
      );
  } catch (error) {
    throw new ApiError(500, "server problem while updating address");
  }
});

const getAddressBYId = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  const isValidaddressId = isValidObjectId(addressId);
  if (!isValidaddressId) {
    throw new ApiError(401, "addressId is not valid");
  }
  try {
    const getAddress = await Address.findById(addressId);
    return res
      .status(200)
      .json(new ApiResponse(200, getAddress, "success get address by Id"));
  } catch (error) {
    throw new ApiError(500, error || "server problem while get address By Id");
  }
});

const getAlluserAddress = asyncHandler(async (req, res) => {
  const allAddress = await Address.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(req.user._id),
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, allAddress, "successfull get all user addresses")
    );
});

const deleteAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  const isValidaddressId = isValidObjectId(addressId);
  if (!isValidaddressId) {
    throw new ApiError(401, "addressId is not valid");
  }

  const address = await Address.findByIdAndDelete(addressId);
  if (!address) throw new ApiError(404, "address doesn't exist");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "delete address successfully"));
});

export {
  add_Address,
  updateAddressById,
  getAddressBYId,
  getAlluserAddress,
  deleteAddress,
};
