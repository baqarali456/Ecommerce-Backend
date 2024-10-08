import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    cartitem:[
        {
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product",
            },
            quantity:{
                type:Number,
                default:1,
            }
        }
    ],
    address:{
     type:mongoose.Schema.Types.ObjectId,
     ref:"Address"
    },
    customer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }
},
{timestamps:true}
)

export const Cart = mongoose.model("Cart",cartSchema)