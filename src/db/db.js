import mongoose from "mongoose"
import {DB_NAME} from "../constants.js"


const connectDB = async() =>{
  try {
    const connectionInstance = await mongoose.connect(`${process.env.DB_URI}/${DB_NAME}`);
    console.log("MONGODB CONNECTION SUCCESSFUL",connectionInstance.connections[0].host);
  } catch (error) {
    console.log("MONGODB CONNECTION FAILED DUE TO",error);
    process.exit(1)
  }
}


export {connectDB}