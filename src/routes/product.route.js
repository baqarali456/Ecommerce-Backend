import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createProduct, deleteProduct, getadminAllProducts, getProductById, getProductsByCategory, getUserAllProducts, updateProduct } from "../controllers/product.controller.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";


const productRouter = Router();
productRouter.use(verifyJWT)



productRouter.route('/create-Product').post(
   adminMiddleware,
   upload.single("productImage"),
   createProduct
)
productRouter.route('/update-product/:productId').patch(adminMiddleware, updateProduct)
productRouter.route('/delete-product/:productId').delete(adminMiddleware, deleteProduct)
productRouter.route('za/getProduct/:productId').get(adminMiddleware, getProductById)
productRouter.route('/getProductsByCategory/:categoryId').get( getProductsByCategory)
productRouter.route('/getall-products').get(verifyJWT,adminMiddleware,getadminAllProducts)
productRouter.route('/usergetall-products').get(verifyJWT,getUserAllProducts)

export { productRouter }