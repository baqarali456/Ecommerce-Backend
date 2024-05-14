import mongoose,{Schema} from "mongoose";

const addressSchema = new Schema(
    {
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
        }
    }
    ,{timestamps:true})

export const Address = mongoose.model("Address",addressSchema);