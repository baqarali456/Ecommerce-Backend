import mongoose,{Schema} from "mongoose";

export const couponSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true,
  },
  startDate:{
    type:Date,
    required:true,
  },
  ExpiryDate:{
    type:Date,
    required:true,
  },
  discountValue:{
    type:Number,
    required:true
  },
  couponCode: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    uppercase: true,
  },
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
  }
},{timestamps:true})