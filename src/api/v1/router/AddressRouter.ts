import { Router } from "express"
import { accessTokenValidate } from "../middleware/Others/VerifyToken"
import { addAddressMiddleware, updateAddressMiddleware } from "../middleware/RouterMiddlewares/DeliveryAddressMiddleware"
import {getAddress,updateAddress,addAddress,deleteAddress} from "../controller/AddressController"
const addressRouter = Router()

addressRouter.post("/", accessTokenValidate, addAddressMiddleware(), addAddress)

addressRouter.get("/", accessTokenValidate, getAddress)

addressRouter.put("/", accessTokenValidate, updateAddressMiddleware() , updateAddress)

addressRouter.delete("/:id?", accessTokenValidate, deleteAddress)

export default addressRouter