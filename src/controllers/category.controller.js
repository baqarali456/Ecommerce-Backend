import { asyncHandler } from "../utils/asyncHandler.js";
import { Category } from "../models/category.model.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { isValidObjectId } from "mongoose";

const create_Category = asyncHandler(async (req, res) => {
    const { name } = req.body;
    if (!name?.trim()) {
        throw new ApiError(401, "name is required");
    }

    try {
        const category = await Category.create({
            name,
            owner: req.user._id,
        })
        return res
            .status(200)
            .json(
                new ApiResponse(200, category, "successfully create category")
            )
    } catch (error) {
        throw new ApiError(500, "server Problem while create category")
    }
})

const getCategoryById = asyncHandler(async (req, res) => {
    const { categoryId } = req.params
    const isValidcategoryId = isValidObjectId(categoryId)
    if (!isValidcategoryId) {
        throw new ApiError(401, "category Id is required")
    }


    const getCategory = await Category.findById(categoryId);
    if (!getCategory) {
        throw new ApiError(404, "category doesn't exist")
    }
    return res
        .status(200)
        .json(
            new ApiResponse(200, getCategory, "successfully get Category By Id")
        )

})

const updateCategory = asyncHandler(async (req, res) => {
    const { categoryId } = req.params
    const { name } = req.body;
    if (!name?.trim()) {
        throw new ApiError(401, "name is required")
    }
    const isValidcategoryId = isValidObjectId(categoryId)
    if (!isValidcategoryId) {
        throw new ApiError(401, "category Id is required")
    }

    const updatedCategory = await Category.findByIdAndUpdate(
        categoryId,
        {
            $set: {
                name,
            }
        },
        {
            new: true,
        }
    )

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedCategory, "update category successfully")
        )
})

const deleteCategory = asyncHandler(async (req, res) => {
    const { categoryId } = req.params
    const isValidcategoryId = isValidObjectId(categoryId)
    if (!isValidcategoryId) {
        throw new ApiError(401, "category Id is required")
    }

    const deletedCategory = await Category.findByIdAndDelete(categoryId)
    if (!deletedCategory) {
        throw new ApiError(404, "category not exist")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, deletedCategory, "successfully delete category")
        )
})


const getadminAllCategories = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query
    const categoriesAggregate = await Category.aggregate([
        {
            $match: {}
        }
    ]);


    const all_Categories = await Category.aggregatePaginate(
        categoriesAggregate,
        {
            page: Math.max(page, 1),
            limit: 10,
            pagination: true,
            customLabels: {
                totalDocs: "allCategoriesByquery",
                docs: "totalallCategories",
                pagingCounter: true,
            }
        }
    )

    return res
        .status(200)
        .json(
            new ApiResponse(200, all_Categories, "successfully get all categories")
        )

})

const getUserAllCategories = asyncHandler(async(req,res)=>{
    const allcategories = await Category.find()
    console.log(allcategories)

    return res
    .status(200)
    .json(new ApiResponse(200,allcategories,"user get all categories"));
})

export {
    create_Category,
    getadminAllCategories,
    getUserAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
}