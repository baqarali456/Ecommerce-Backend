import {v2 as cloudinary} from 'cloudinary';
import fs from "fs"

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET // Click 'View Credentials' below to copy your API secret
});

const uploadonCloudinary = async(localFilepath) =>{
    console.log("hello")
    try {
        if(!localFilepath) return null;
        const uploadResult = await cloudinary.uploader.upload(localFilepath, {
                resource_type:"auto",
        })
       fs.unlinkSync(localFilepath)
       console.log("response in cloudinary",uploadResult)

       return uploadResult;

    } catch (error) {
        console.log("error in cloud",error)
        fs.unlinkSync(localFilepath);
        return null;
    }
}

export {uploadonCloudinary}