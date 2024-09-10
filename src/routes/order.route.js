import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js"
import { createOrder, getallOrders } from "../controllers/order.controller.js";

export const orderRouter = Router()

orderRouter.route('/create-order').post(verifyJWT,createOrder)
orderRouter.route('/getalluserOrders').get(verifyJWT,getallOrders)