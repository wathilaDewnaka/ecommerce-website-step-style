const express = require("express");
const multer = require("multer")
const { addProduct, listProducts, removeProduct} = require("../controllers/productController")
const authMiddleWare = require("../middleware/auth")
const productRouter = express.Router()

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

productRouter.post("/add", upload.single("image"), authMiddleWare, addProduct)
productRouter.get("/list", listProducts)
productRouter.post("/remove", authMiddleWare, removeProduct)

module.exports = productRouter ;