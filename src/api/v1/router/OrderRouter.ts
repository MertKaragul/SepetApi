import { Router } from "express";
import { createOrder, patchOrder, getOrders } from "../controller/OrderController";
import { createOrderMiddleware, deleteOrderMiddleware, getOrdersMiddleware } from "../middleware/RouterMiddlewares/OrderMiddleware";
const orderRouter = Router()

orderRouter.get("/", getOrdersMiddleware() ,getOrders)
orderRouter.post("/", createOrderMiddleware(), createOrder)
orderRouter.patch("/:orderId?", deleteOrderMiddleware(), patchOrder)

export default orderRouter