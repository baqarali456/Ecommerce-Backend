import { asyncHandler } from "../utils/asyncHandler";

const createProduct = asyncHandler(async(req,res)=>{
    const {} = req.body;
})


export {
    createProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
    getProductsByCategory,
    updateProduct,
  };