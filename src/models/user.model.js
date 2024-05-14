import mongoose,{Schema} from "mongoose";

const userSchema = new Schema(
    {
        username:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        email:{
            type: String,
            required: true,
            unique: true,
            lowercase: true, 
        },
        password:{
            type: String,
            required: true
        },
        address:[
            {
            type:Schema.Types.ObjectId,
            ref:"Address"
            }
        ],
        refreshToken:{
            type:String,
        }
    }
    ,{timestamps:true})

export const User = mongoose.model("User",userSchema);