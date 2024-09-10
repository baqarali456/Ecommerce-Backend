import mongoose, { isValidObjectId } from "mongoose";
import { Cart } from "../models/cart.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { instance } from "../utils/Razorpayinstance.js";
import { getTotalPriceCart } from "./cart.controller.js";
import { ApiError } from "../utils/ApiError.js";
import { Address } from "../models/address.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.model.js";
import crypto from "crypto";

const RazorPayInstance = instance();

export const createOrder = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  if (!isValidObjectId(addressId)) {
    throw new ApiError(401, "address is not valid");
  }

  const address = await Address.findById(addressId);
  if (!address) throw new ApiError(401, "address not exist");

  const cart = await Cart.findOne({ customer: req.user._id });
  const { cartitem } = cart;

  const totalPrice = await getTotalPriceCart(req.user._id);

  const options = {
    amount: totalPrice * 100,
    currency: "INR",
    receipt: "baqar123",
  };

  RazorPayInstance.orders.create(options, async function (err, order) {
    if (err) {
      return res
        .status(500)
        .json(
          new ApiResponse(
            500,
            {},
            err.message || "something went wrong while generating order"
          )
        );
    }

    const unpaidEcomorder = await Order.create({
      orderPrice: totalPrice,
      orderitems: cartitem,
      customer: req.user._id,
      address: addressId,
      paymentId: order.id,
    });
    if (!unpaidEcomorder) {
      return res.status(500).json("something went wrong while creating prder");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, unpaidEcomorder, "order is created successfully")
      );
  });
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body;

  generated_signature = hmac_sha256(
    order_id + "|" + razorpay_payment_id,
    secret
  );

  let body = razorpay_order_id + "|" + razorpay_payment_id;

  let expectedSignature = crypto
    .createHmac("sha256", process.env.RAZARPAY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    const order = await Order.findByIdAndUpdate(
      {
        paymentId: razorpay_order_id,
      },
      {
        $set: {
          paymentSuccess: true,
          paymentMessage: Done,
        },
      }
    );
    return res
      .status(200)
      .json(new ApiResponse(200, order, "order payment done"));
  }
  throw new ApiError(401, "invalid signature");
});

export const getallOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const alluserorders = await Order.aggregate([
    {
      $match: {
        customer: new mongoose.Types.ObjectId(req.user?._id),
      },
    },
  ]);

  const getallUserOrders = await Order.aggregatePaginate(alluserorders, {
    page: Math.max(page, 1),
    limit: Math.max(limit, 10),
    customLabels: {
      totalDocs: "totalordersmatchByQuery",
      totalPages: "numberofpages",
      prevPage:"prevPage",
      hasNextPage:"hasNextPage",
      pagingCounter:"pagingCounter"
    },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, getallUserOrders, "successfully get user all orders")
    );
});
