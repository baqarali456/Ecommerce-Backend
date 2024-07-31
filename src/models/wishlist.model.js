import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
    favourites:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product"
        }
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"  
    }
},{timestamps:true,})


export const Wishlist = mongoose.model("Wishlist",wishlistSchema)