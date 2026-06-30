import mongoose from "mongoose"

const productSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        productName: {
            type: String, required: true
        },
        productDesc: {
            type: String, required: true
        },
        productPrice: {
            type: Number
        },
        category: {
            type: String
        },
        brand: {
            type: String
        },
        productImg: [       
            {
                url: String,
                public_id: String
            }
        ]
    },
    { timestamps: true }
)
export const Product = mongoose.model("Product" , productSchema)