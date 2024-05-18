import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createProduct, deleteProduct, getAllProducts, getProductById, getProductsByCategory, updateProduct } from "../controllers/product.controller.js";

const productRouter = Router();

productRouter.use(verifyJWT)

productRouter.route('/create-Product').post(createProduct)
productRouter.route('/update-product/:productId').patch(updateProduct)
productRouter.route('/delete-product/:productId').delete(deleteProduct)
productRouter.route('/getProduct/:productId').get(getProductById)
productRouter.route('/getProductsByCategory/:categoryId').get(getProductsByCategory)
productRouter.route('/getall-products').get(getAllProducts)

export {productRouter}