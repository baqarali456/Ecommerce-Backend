import mongoose, { Schema } from "mongoose";

export const wishlistSchema = new mongoose.Schema(
  {
    favourites: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Wishlist = mongoose.model("Wishlist", wishlistSchema);
