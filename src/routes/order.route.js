import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js"
import { createOrder } from "../controllers/order.controller.js";

export const orderRouter = Router()

orderRouter.route('/create-order').post(verifyJWT,createOrder)