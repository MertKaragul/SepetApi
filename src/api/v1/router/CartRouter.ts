import { Router } from "express";
import { addToCart, deleteCartProduct, getCart, orderCart, updateCart } from "../controller/CartController";
import { addToCartMiddleware, deleteCartProductMiddleware,  updateCartMiddleware } from "../middleware/RouterMiddlewares/CartMiddleware";
import { accessTokenValidate } from "../middleware/Others/VerifyToken";
const cartRouter = Router()

cartRouter.post("/", accessTokenValidate,addToCartMiddleware(),addToCart)

cartRouter.put("/", accessTokenValidate, updateCartMiddleware(), updateCart)

cartRouter.get("/:ordered?", accessTokenValidate,getCart)

cartRouter.delete("/:id?", accessTokenValidate, deleteCartProductMiddleware(), deleteCartProduct)

cartRouter.post("/order", accessTokenValidate, orderCart)



export default cartRouter