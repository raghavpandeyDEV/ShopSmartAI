import express from "express";
import { Product } from "../model/productModel.js";
import { shoppingAssistant } from "../utils/aiAssistant.js";

const router = express.Router();

router.post("/assistant", async (req, res) => {
  try {

    const { question } = req.body;

    const products = await Product.find();

    const answer =
      await shoppingAssistant(
        products,
        question
      );

    res.json({
      success: true,
      answer,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
});

export default router;

//AI suggestions 

router.get("/recommend/:id", async (req, res) => {

  try {

    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {

      return res.status(404).json({
        success: false,
        message: "Product not found"
      });

    }

    const recommendations =
      await Product.find({
        category: product.category,
        _id: { $ne: product._id }
      }).limit(4);

    res.json({
      success: true,
      recommendations
    });

  } catch(error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

});