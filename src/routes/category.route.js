import { Router } from "express";
import { create_Category, deleteCategory, getadminAllCategories, getCategoryById, getUserAllCategories, updateCategory } from "../controllers/category.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js"
import { adminMiddleware } from "../middlewares/admin.middleware.js";

const categoryRouter = Router();


categoryRouter.route('/allcategories').get(verifyJWT,getUserAllCategories)
categoryRouter.route('/adminallcategories').get(verifyJWT,adminMiddleware,getadminAllCategories)
categoryRouter.route('/add-category').post(verifyJWT,adminMiddleware,create_Category)
categoryRouter.route('/update-category/:categoryId').patch(verifyJWT,adminMiddleware,updateCategory);
categoryRouter.route('/get-category/:categoryId').get(verifyJWT,adminMiddleware,getCategoryById);
categoryRouter.route('/delete-category/:categoryId').delete(verifyJWT,adminMiddleware,deleteCategory)

export {categoryRouter}