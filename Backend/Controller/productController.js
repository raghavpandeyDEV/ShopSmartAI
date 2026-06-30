import { Product } from "../model/productModel.js"
import cloudinary from "../utils/cloudinary.js"
import getDataUri from "../utils/dataUri.js"

export const addProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllProducts=async(req,res)=>{
try{
const products = await Product.find()
if(!products){
    return res.status(404).json({
        success:false,
        message : "No Products Available",
        products : []
    })
}
return res.status(200).json({
    success:true,
    products
})
}
catch(error){
    return res.status(500).json({
            success : false,
            message : error.message
        })
}
}

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "No Product Found",
      });
    }

    await Product.findByIdAndDelete(productId);

    return res.status(200).json({
      success: true,
      message: "Product deleted Successfully!!",
    });

  } catch (error) {
    console.log("DELETE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.productName = req.body.productName || product.productName;
    product.productPrice = req.body.productPrice || product.productPrice;
    product.productDesc = req.body.productDesc || product.productDesc;
    product.category = req.body.category || product.category;
    product.brand = req.body.brand || product.brand;

    if (req.body.productImg) {
      product.productImg = req.body.productImg;
    }

    await product.save();

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};