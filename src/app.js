import cookieParser from "cookie-parser"
import express from "express";
import cors from "cors"

const app = express();

app.use(express.static("public"));
app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({limit:"16kb",extended:true}));
app.use(cookieParser())
app.use(cors({
    origin:process.env.ORIGIN,
    credentials:true
}))

// import routes
import { userRouter } from "./routes/user.route.js";
import { addressRouter } from "./routes/address.route.js";
import { categoryRouter } from "./routes/category.route.js";
import { productRouter } from "./routes/product.route.js";
import { wishlistRouter } from "./routes/wishlist.route.js";


// declaration routes
app.use('/api/v1/users',userRouter)
app.use('/api/v1/address',addressRouter)
app.use('/api/v1/category',categoryRouter)
app.use('/api/v1/products',productRouter)
app.use('/api/v1/wishlist',wishlistRouter)

export {app}