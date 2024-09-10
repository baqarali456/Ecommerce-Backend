import mongoose,{Schema} from "mongoose";


const orderSchema = new Schema(
    {
        orderPrice:{
            type:Number,
            required:true,
        },
        orderitems:[
            {
                productId:{
                    type:Schema.Types.ObjectId,
                    ref:"Product"
                },
                quantity:{
                    type:Number,
                    default:1,
                }
            }
        ],
        customer:{
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        status:{
            type: String,
            enum: ["PENDING","CANCELLED","DELIVERED"],
            default: "PENDING",
        },
        address:{
            type:Schema.Types.ObjectId,
            ref:"Address"
        },
        paymentSuccess:{
            type:Boolean,
            default:false
        },
        paymentMessage:{
            type:String,
            enum:["Pending","Done","Failed"],
            default:"Pending"
        },
        paymentId:{
            type:String,
            required:true,
        }
    }
    ,{timestamps:true})

export const Order = mongoose.model('Order',orderSchema)