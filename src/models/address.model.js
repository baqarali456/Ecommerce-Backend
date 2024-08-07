import mongoose,{Schema} from "mongoose";

const addressSchema = new Schema(
    {
        fullName:{
         type: String,
         required: true,
        },
        phoneNumber:{
         type: Number,
         required: true,
        },
        city:{
            type: String,
            required: true,
        },
        state:{
            type: String,
            required: true,
        },
        pincode:{
            type: Number,
            required: true,
        },
        landmark:{
            type: String,
            required: true
        },
        street:{
            type: String,
            required: true,
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User",
        },
        type:{
            type:String,
            enum:["Home","Work","Office"],
            default:"Home"
        }
    }
    ,{timestamps:true})

export const Address = mongoose.model("Address",addressSchema);