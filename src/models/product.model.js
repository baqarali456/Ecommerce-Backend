import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginateV2 from "mongoose-aggregate-paginate-v2";

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
        },
    }
    ,{timestamps:true})

    productSchema.plugin(mongooseAggregatePaginateV2)

export const Product = mongoose.model("Product",productSchema)