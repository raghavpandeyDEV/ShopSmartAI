import axios from 'axios';
import React from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { setCart } from '../redux/productSlice.js'  
const ProductCard = ({ product, loading }) => {


  const { productImg, productPrice, productName } = product;
   const accessToken=localStorage.getItem(`accessToken`)
   const dispatch=useDispatch();
   const navigate=useNavigate();


  const addToCart =async(productId)=>{
    try {
      const res=await axios.post(`${import.meta.env.VITE_URL}/api/v1/cart/add` ,{productId},{
        headers : 
        {
          Authorization : `Bearer ${accessToken}`
        }
      })
      if(res.data.success){
        toast.success("Product added to Cart !!")
        dispatch(setCart(res.data.cart))
      }
    } catch (error) {
      toast.error("Error adding to Cart !!")
    }
  }
      
  return (
    <div className="shadow-lg rounded-lg overflow-hidden max-h-max">
      <div className="w-full aspect-square overflow-hidden">
        <img onClick={()=>navigate(`/products/${product._id}`)}
          src={productImg?.[0]?.url}
          alt={productName}
          className="w-full h-full transition-transform duration-300 hover:scale-105 cursor-pointer object-cover"
        /> 
      </div>

      <div className="px-2 space-y-1">
        <h1 className="font-semibold h-12 line-clamp-2">
          {productName}
        </h1>

        <h2 className="font-bold">₹{productPrice}</h2>

        <button
  onClick={() => addToCart(product._id)}
  className="bg-pink-600 hover:bg-pink-900 mb-3 w-full text-white py-2 rounded-lg"
>
  Add to Cart
</button>
      </div>
    </div>
  );
};

export default ProductCard;

