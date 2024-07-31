import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createProduct, deleteProduct, getAllProducts, getProductById, getProductsByCategory, updateProduct } from "../controllers/product.controller.js";
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
productRouter.route('/getProduct/:productId').get(adminMiddleware, getProductById)
productRouter.route('/getProductsByCategory/:categoryId').get(adminMiddleware, getProductsByCategory)
productRouter.route('/getall-products').get(getAllProducts)

export { productRouter }