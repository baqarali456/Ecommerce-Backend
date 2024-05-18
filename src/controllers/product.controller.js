import mongoose, { isValidObjectId } from "mongoose";
import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadonCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Category } from "../models/category.model.js"

const createProduct = asyncHandler(async(req,res)=>{

    const {name,description,price,stock,category} = req.body;
    if(!name?.trim() || !description?.trim()){
        throw new ApiError(401,"name or description is required")
    }
 
    const productImagePath = req.file?.path;

    const existCategory = await Category.findById(category)
    if(!existCategory){
        throw new ApiError(404,"category doesn't exist")
    }

   const productImage = await uploadonCloudinary(productImagePath)
   if(!productImage){
    throw new ApiError(401,"Product Image is required")
   }


  const product = await Product.create({
    name,
    description,
    price,
    stock,
    category,
    productImage:productImage.url,
    owner:req.user._id,
  })

   return res
   .status(200)
   .json(
    new ApiResponse(200,product,"successfully create Products")
   )

})

const deleteProduct = asyncHandler(async(req,res)=>{
    const {productId} = req.params;
    const isValidproductId = isValidObjectId(productId)
    if(!isValidproductId){
       throw new ApiError(401,"product is not valid")
    }
    const deletedProduct = await Product.findByIdAndDelete(productId)
    if(!deletedProduct){
        throw new ApiError(404,"product doesn't exist")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,deletedProduct,"successfully deleted product")
    )


})

const updateProduct = asyncHandler(async(req,res)=>{
    const {productId} = req.params;
    const {name,description,price,stock,category} = req.body;

    const isValidproductId = isValidObjectId(productId)
    if(!isValidproductId){
       throw new ApiError(401,"product is not valid")
    }

    if(!name?.trim() || !description?.trim()){
        throw new ApiError(401,"name or description is required")
    }

    const existCategory = await Category.findById(category)
    if(!existCategory){
        throw new ApiError(404,"category doesn't exist")
    }
 
    const productImagePath = req.file?.path;
    console.log(productImagePath);

   const productImage = await uploadonCloudinary(productImagePath)
   if(!productImage){
    throw new ApiError(401,"Product Image is required")
   }

    const updatedproduct = await Product.findByIdAndUpdate(
        productId,
        {
            $set:{
               name,
               description,
               productImage:productImage.url,
               stock,
               price,
               category

            }
        },
        {
            new : true
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200,updatedproduct,"update Product successfully")
    )
})

const getProductsByCategory = asyncHandler(async(req,res)=>{
    const {categoryId} = req.params;
    const {page=1,limit=10} = req.query;
    const isValidcategoryId = isValidObjectId(categoryId)
    if(!isValidcategoryId){
       throw new ApiError(401,"categoryIds not valid")
    }

    const category = await Category.findById(categoryId)
   const productaggregate = await Product.aggregate([
        {
            $match:{
                category:new mongoose.Types.ObjectId(categoryId)
            }
        }
    ])

    const allProductsByCategory = await Product.aggregatePaginate(
        productaggregate,
        {
            page:Math.max(page,1),
            limit:Math.max(limit,1),
            pagination:true,
            customLabels:{
                pagingCounter:true,
                totalDocs:"totalProductbycategory",
                docs:"allproductsByquery",
            }
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200,{category:category.name,allProductsByCategory},"successfully get all Products By Category")
    )
})

const getAllProducts = asyncHandler(async(req,res)=>{
   const {page=1,limit=10} = req.query
    const productaggregate = await Product.aggregate([
        {
            $match:{}
        }
    ]);

   const ALL_PRODUCTS = await Product.aggregatePaginate(
        productaggregate,
        {
            page:Math.max(page,1),
            limit:Math.max(limit,1),
            pagination:true,
            customLabels:{
                pagingCounter:true,
                totalDocs:"totalallProductsByquery",
                docs:"allProducts"
            }

        }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200,ALL_PRODUCTS,"successfully get all Products")
    )
})

const getProductById = asyncHandler(async(req,res)=>{
    const {productId} = req.params;

    const isValidproductId = isValidObjectId(productId)
    if(!isValidproductId){
       throw new ApiError(401,"product is not valid")
    }

   const product = await Product.findById(productId)
   if(!product){
    throw new ApiError(404,"product doesn't exist")
   }

   return res
   .status(200)
   .json(
    new ApiResponse(200,product,"successfull product by Id")
   );
})

export {
    createProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
    getProductsByCategory,
    updateProduct,
  };