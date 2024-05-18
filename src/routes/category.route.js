import { Router } from "express";
import { create_Category, deleteCategory, getAllCategories, getCategoryById, updateCategory } from "../controllers/category.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const categoryRouter = Router();
categoryRouter.use(verifyJWT)

categoryRouter.route('/add-category').post(create_Category)
categoryRouter.route('/update-category/:categoryId').patch(updateCategory)
categoryRouter.route('/get-category/:categoryId').get(getCategoryById)
categoryRouter.route('/delete-category/:categoryId').delete(deleteCategory)
categoryRouter.route('getallCategories').get(getAllCategories)

export {categoryRouter}