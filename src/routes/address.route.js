import { Router } from "express";
import { add_Address, deleteAddress, getAddressBYId, getAlluserAddress, updateAddressById } from "../controllers/address.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const addressRouter = Router();

addressRouter.use(verifyJWT);

addressRouter.route('/add-address').post(add_Address)
addressRouter.route('/get-address/:addressId').get(getAddressBYId)
addressRouter.route('/update-addess/:addressId').patch(updateAddressById)
addressRouter.route('/delete-address/:addressId').delete(deleteAddress)
addressRouter.route('/getallAddress').get(getAlluserAddress)

export {addressRouter}