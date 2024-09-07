const mongoose = require("mongoose");

// Define the product schema with image stored as a blob (binary data)
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { 
        data: { type: Buffer, required: true },  
        contentType: { type: String, required: true },  
    },
    category: { type: String, required: true }
});

// Define the product model (with fallback to avoid model recompilation)
const productModel = mongoose.models.product || mongoose.model("product", productSchema);

// Export both model and schema
module.exports = { productModel, productSchema };
