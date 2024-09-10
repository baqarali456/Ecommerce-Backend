import { app } from "./app.js";
import { connectDB } from "./db/db.js";


  connectDB()
  .then(()=>{
    app.listen(process.env.PORT || 4000,()=>{
        console.log("SERVER LISTENING ON PORT",process.env.PORT)
        
    })
    app.on("error",(err)=>{
       console.log(`ERROR IN  server ${err}`)
    })
  })
  .catch((err)=>{
    console.log("PROBLEM IN EXPRESS APP",err)
  })
  