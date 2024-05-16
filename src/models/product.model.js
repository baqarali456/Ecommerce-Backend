import mongoose,{Schema, mongo} from "mongoose";

const productSchema = new Schema(
    {
        name:{
            type: String,
            required: true
        },
        productImage:{
            type:String,
            required: true,
        },
        description:{
            type: String,
            required: true,
        },
        category:{
            type:Schema.Types.ObjectId,
            ref:"Category",
            required: true,
        },
        price:{
            type:Number,
            default:0
        },
        stock:{
            type: Number,
            default: 0,
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User"
        }
    }
    ,{timestamps:true})

export const Product = mongoose.model("Product",productSchema)