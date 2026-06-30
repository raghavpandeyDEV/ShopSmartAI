import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { setCart } from "@/redux/productSlice";
import { toast } from "sonner";


const Cart = () => {
  const { cart } = useSelector((store) => store.product);
  const dispatch=useDispatch();
  const navigate=useNavigate();
 const API="http://localhost:8000/api/v1/cart"
 const accessToken=localStorage.getItem(`accessToken`)

 


  const subtotal =
    cart?.items?.reduce(
      (acc, item) =>
        acc + item?.productId?.productPrice * item?.quantity,
      0
    ) || 0;

  const shipping = subtotal > 500 ? 0 : 50;
  const tax = Math.floor(subtotal * 0.05);
  const total = subtotal + shipping + tax;


  const loadCart=async()=>{
     try {
      const res = await axios.get(API, 
        {headers : {
          Authorization : `Bearer ${accessToken}`
        }}
      )

      if(res.data.success){
        dispatch(setCart(res.data.cart))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleUpdateQuantity = async(productId, type)=>{
    try {
      const res = await axios.put(`${API}/update` , {productId , type} , 
        {headers : {
          Authorization : `Bearer ${accessToken}`
        }}
      )

      if(res.data.success){
        dispatch(setCart(res.data.cart))
      }
    } catch (error) {
      console.log(error)
    }
  }
   

  const handleRemove = async(productId)=>{
    try {
      const res = await axios.delete(`${API}/remove` ,  
        {headers : {
          Authorization : `Bearer ${accessToken}`
        },
      data : { productId}}
      )

      if(res.data.success){
        dispatch(setCart(res.data.cart))
        toast.success('Product Removed from the cart!')
      }
    } catch (error) {
      console.log(error)
      toast.error('Failed to Remove product from cart !!')
    }
  }

  useEffect(()=>{
    loadCart()
  },[dispatch]
  )
  return (
    <div className="pt-20 bg-gray-50 min-h-screen">
      {cart?.items?.length > 0 ? (
        <div className="max-w-7xl mx-auto flex gap-8 px-4">

          {/* LEFT SIDE (ITEMS) */}
          <div className="flex flex-col gap-5 flex-[2]">
            <h1 className="text-2xl font-bold mb-4 mt-7">Shopping Cart</h1>

            {cart.items.map((product, index) => (
              <Card key={index}>
                <div className="flex items-center justify-between p-5 gap-4">

                  {/* LEFT: IMAGE + NAME */}
                  <div className="flex items-center gap-4 w-[35%]">
                    <img
                      src={product?.productId?.productImg?.[0]?.url}
                      alt={product?.productId?.productName}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div>
                      <h1 className="font-semibold">
                        {product?.productId?.productName}
                      </h1>
                      <p className="text-gray-500 text-sm">
                        ₹{product?.productId?.productPrice}
                      </p>
                    </div>
                  </div>

                  {/* CENTER: QUANTITY */}
                  <div className="flex items-center gap-3">
                    <Button onClick={()=>handleUpdateQuantity(product.productId._id , 'decrease')} variant="outline" size="icon">-</Button>
                    <span className="font-medium w-6 text-center">
                      {product?.quantity}
                    </span>
                    <Button onClick={()=>handleUpdateQuantity(product.productId._id , 'increase')} variant="outline" size="icon">+</Button>
                  </div>

                  {/* RIGHT: PRICE + REMOVE (inline) */}
                  <div className="flex items-center gap-4 justify-end w-[200px]">
                    <p className="font-semibold text-lg">
                      ₹{(product?.productId?.productPrice * product?.quantity).toLocaleString("en-IN")}
                    </p>
                    <button onClick ={()=>handleRemove(product?.productId?._id)}className="flex items-center gap-1 text-red-500 text-sm whitespace-nowrap">
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  </div>

                </div>
              </Card>
            ))}
          </div>

          {/* RIGHT SIDE (SUMMARY) */}
          <div className="flex-[1] mt-8">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">

                <div className="flex justify-between">
                  <span>Subtotal ({cart?.items?.length} items)</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹{shipping}</span>
                </div>

                <div className="flex justify-between">
                  <span>Tax (5%)</span>
                  <span>₹{tax}</span>
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{total.toLocaleString("en-IN")}</span>
                </div>

                {/* PROMO */}
                <div className="space-y-3 pt-3">
                  <div className="flex gap-2">
                    <Input placeholder="Promo Code" />
                    <Button variant="outline">Apply</Button>
                  </div>

                  <Button onClick={()=>navigate('/address')}className="w-full bg-pink-600 text-white">
                    PLACE ORDER
                  </Button>

                  <Button variant="outline" className="w-full bg-transparent">
                    <Link to="/products">Continue Shopping</Link>
                  </Button>
                </div>

                {/* EXTRA INFO */}
                <div className="text-sm text-gray-500 pt-4 space-y-1">
                  <p>✔ Free shipping on orders over ₹299</p>
                  <p>✔ 30-days return policy</p>
                  <p>✔ Secure checkout with SSL encryption</p>
                </div>

              </CardContent>
            </Card>
          </div>

        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-20 text-center">
      
      <p className="mt-2 text-gray-600">
        Looks like you haven't added anything to your cart yet
      </p>

      <Button
        onClick={() => navigate("/products")}
        className="mt-6 bg-pink-600 text-white hover:bg-pink-700"
      >
        Start Shopping
      </Button>

    </div>
      )}
    </div>
  );
};

export default Cart;