import {v2 as cloudinary} from 'cloudinary';
import fs from "fs"
cloudinary.config({ 
    cloud_name: "dhcamra6a", 
    api_key: "361346215217979", 
    api_secret: "<your_api_secret>" // Click 'View Credentials' below to copy your API secret
});

const uploadonCloudinary = async(localFilepath) =>{
    try {
        if(!localFilepath) return null;
        const uploadResult = await cloudinary.uploader.upload(localFilepath, {
                resource_type:"auto",
        })
       fs.unlinkSync(localFilepath)
       return uploadResult;

    } catch (error) {
        fs.unlinkSync(localFilepath);
        return null;
    }
}

export {uploadonCloudinary}