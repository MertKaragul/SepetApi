import express from "express"
import productRouter from "./api/v1/router/ProductRouter"
import "../src/api/v1/service/DatabaseService"
import ErrorHandler from "./api/v1/middleware/ErrorHandler"
const app = express()

app.use("/storage", express.static("storage"))
app.use(express.urlencoded({extended : true}))
app.use(express.json())

app.use("/product", productRouter)

app.use(ErrorHandler)
app.listen(3000)
