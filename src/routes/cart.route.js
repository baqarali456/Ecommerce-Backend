import { Router } from "express";
import { addProductinCart, changeQuantity, createCart, removeProductinCart, userGetAllCartItems, userGetTotalCartPrice } from "../controllers/cart.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
export const cartRouter = Router()


cartRouter.route('/create-cart').post(verifyJWT,createCart)
cartRouter.route('/addproduct-cart/:productId').patch(verifyJWT,addProductinCart)
cartRouter.route('/removeproduct-cart/:productId').patch(verifyJWT,removeProductinCart)
cartRouter.route('/change-quantity-in-product-cart/:productId').patch(verifyJWT,changeQuantity)
cartRouter.route('/getusercart').get(verifyJWT,userGetAllCartItems)
cartRouter.route('/getuserTotalAmountcart').get(verifyJWT,userGetTotalCartPrice)