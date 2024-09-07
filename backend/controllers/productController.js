const { adminModel } = require("../models/adminModel")
const { productModel } = require("../models/productModel")

const addProduct = async(req,res) => {
    try{
        const product = new productModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: {
                data: req.file.buffer, // Binary data from the uploaded image
                contentType: req.file.mimetype // Image MIME type
            }
        })

        const admin = await adminModel.findById(req.body.userId)

        if(!admin){
            return res.json({success: false, message: "Unauthorized"})
        }

        await product.save()
        return res.json({success: true, message: "Product Added"})

    } catch(error){
        console.log(error)
        res.json({success: false, message: "Error"})
    }

}

const listProducts = async(req,res) => {
    try{
        const products = await productModel.find({});

        const updatedProducts = products.map(product => {
            // Convert image blob (binary data) to base64
            const base64Image = product.image ? product.image.data.toString('base64') : null;
            
            return {
                ...product._doc, // Spread the existing product data
                image: base64Image ? `data:${product.image.contentType};base64,${base64Image}` : null
            };
        });

        
        return res.json({success: true, data: updatedProducts})
    } catch (error){
        console.log(error)
        return res.json({success: false, message: "Error"})
    }
}

const removeProduct = async(req,res) => {
    try{
        const admin = await adminModel.findById(req.body.userId)
        if(!admin){
            return res.json({success: false, message: "Unauthorized"})
        }

        await productModel.findByIdAndDelete(req.body.id)
        res.json({success: true, message: "Product Removed"})
    } catch (error){
        console.log(error)
        res.json({success: false, message: "Error"})
    }
}

module.exports = { addProduct, listProducts, removeProduct }