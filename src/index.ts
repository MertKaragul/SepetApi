import express from "express"
import productRouter from "./api/v1/router/ProductRouter"
import "../src/api/v1/service/DatabaseService"
import ErrorHandler from "./api/v1/middleware/Handler/ErrorHandler"
import authRouter from "./api/v1/router/AuthRouter"
import categoryRouter from "./api/v1/router/CategoryRouter"
import "./api/v1/extension/StringExtension"
import cartRouter from "./api/v1/router/CartRouter"
import addressRouter from "./api/v1/router/AddressRouter"

const app = express()

app.use("/storage", express.static("storage"))
app.use(express.urlencoded({extended : true}))
app.use(express.json())

app.use("/products", productRouter)
app.use("/category", categoryRouter)
app.use("/auth", authRouter)
app.use("/cart",cartRouter)
app.use("/address",addressRouter)

app.use(ErrorHandler)
app.listen(3000)
