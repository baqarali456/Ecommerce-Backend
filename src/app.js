import cookieParser from "cookie-parser";
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

export {app}