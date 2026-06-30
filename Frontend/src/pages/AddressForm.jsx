import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { Card , CardHeader ,CardTitle  ,CardContent} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { addAddress, deleteAddress, setCart, setSelectedAddress } from '@/redux/productSlice'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const AddressForm = () => {
    const [formData,setFormData]=useState({
        fullName : "",
        phone:"",
        lastName : "",
        email: "",
        address:"",
        city:"",
        state:"",
        zip:"",
        country:""
    })

    const dispatch=useDispatch();
    const navigate=useNavigate();

   const {cart , addresses,selectedAddress}=useSelector((store)=>store.product) 
    const subtotal=cart.totalPrice
    const shipping = subtotal>50 ? 0 : 50
    const tax=parseFloat((subtotal*0.05).toFixed(2))
    const total = subtotal + tax + shipping

    

    const [showForm , setShowForm]=useState(addresses?.length > 0 ? false:true)

    const handleChange = (e)=>{
        setFormData({...formData,[e.target.name]:e.target.value})
    }

    const handleSave = () =>{
        dispatch(addAddress(formData))
        setShowForm(false)
    }
   
     const accessToken=localStorage.getItem("accessToken")
    const handlePayment = async()=>{
     

      try {
        const {data}=await axios.post(`${import.meta.env.VITE_URL}/api/v1/orders/create-order` , {
          products:cart?.items?.map(item=>({
            productId : item.productId._id,
            quantity:item.quantity
          })),
          tax,
          shipping,
          amount:total,
          currency:"INR"
        } ,
      {
        headers: {Authorization : `Bearer ${accessToken}`}
      })

      if(!data.success)return toast.error("Something went wrong")
      
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: data.order.amount,
    currency: data.order.currency,
    order_id: data.order.id,
    name :"Ekart",
    description:"Order Payment",
    handler : async function(response){
      try {
        const verifyRes=await axios.post(`${import.meta.env.VITE_URL}/api/v1/orders/verify-payment` , response , {
          headers : { Authorization : `Bearer ${accessToken}` }
        })

        if(verifyRes.data.success){
          toast.success("Payment Successfull")
          dispatch(setCart({items:[] , totalPrice : 0}))
          navigate("/order-success")
        }
        else{
          toast.error("Payment Verification failed !")
        }
      } catch (error) {
        toast.error("Error verifying Payment !!")
      }
    },
    modal : {
      ondismiss : async function () {
        await axios.post(`${import.meta.env.VITE_URL}/api/v1/orders/verify-payment` , {
          razorpay_order_id : data.order.id,
          paymentFailed:true
        },{
          headers: {Authorization:`Bearer ${accessToken}`}
        })
        toast.error("Payment Cancelled or Failed !")
      }
    },
    prefill:{
      name : formData.fullName,
      email:formData.email,
      contact:formData.phone
    },
    theme : {color : '#F472B6'}
        }
    const rzp=new window.Razorpay(options)
  
      //Listen for payment failures

      rzp.on("payment.failed" , async function (response) {
        await axios.post(`${import.meta.env.VITE_URL}/api/v1/orders/verify-payment` , {
           razorpay_order_id : data.order.id,
          paymentFailed:true
        } ,{
          headers : {Authorization : `Bearer ${accessToken}`}
        })
        toast.error("Payment Failed . Please try again !!")
      })

      rzp.open()
      } catch (error) {
        console.log(error)
        toast.error("Something went wrong proccessing payment !!")
      }
    }

  return (
    <div>
      <div className="max-w-7xl mx-auto px-6 py-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] items-start gap-10">

          <div className="space-y-4 p-6 bg-white">
            {
              showForm ? (
                <>
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      required
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      required
                      placeholder="+91 9583839241"
                      value={formData?.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      required
                      placeholder="John Doe"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      required
                      placeholder="123 Street , Area"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          name="city"
                          required
                          placeholder="Kolkata"
                          value={formData.city}
                          onChange={handleChange}
                        />
                      </div>

                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          name="state"
                          required
                          placeholder="West Bengal"
                          value={formData.state}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                      <div>
                        <Label htmlFor="zip">Zip Code</Label>
                        <Input
                          id="zip"
                          name="zip"
                          required
                          placeholder="211004"
                          value={formData.zip}
                          onChange={handleChange}
                        />
                      </div>

                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          name="country"
                          required
                          placeholder="India"
                          value={formData.country}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <Button onClick={handleSave} className='mt-4 w-full'>Save & Continue</Button>
                  </div>
                </>
              ) : (
                <div className='space-y-4'>
                  <h2 className='text-lg font-semibold'>Saved Addresses</h2>

                  {
                    addresses.map((addr, index) => {
                      return (
                        <div
                          key={index}
                          onClick={()=>dispatch(setSelectedAddress(index))}
                          className={`border p-4 rounded-md cursor-pointer relative ${
                            selectedAddress === index
                              ? 'border-pink-600 bg-pink-50'
                              : 'border-gray-300'
                          }`}
                        >
                          <p className='font-medium'>{addr.fullName}</p>
                          <p>{addr.phone}</p>
                          <p>{addr.email}</p>
                          <p>
                            {addr.address}, {addr.city}, {addr.state}, {addr.zip}, {addr.country}
                          </p>
                          <button onClick={(e)=>dispatch(deleteAddress(index))} className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm">
                            Delete
                          </button>
                        </div>
                      )
                    })
                  }
                  <Button variant="outline" onClick={()=>setShowForm(true)} className='w-full'>+ Add New Address</Button>
                  <Button
                    disabled={selectedAddress === null}
                    onClick={handlePayment}
                    className="w-full bg-pink-600"
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              )
            }
          </div>

          <div className="lg:sticky lg:top-10">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">

                <div className="flex justify-between">
                  <span>Subtotal ({cart.length} items)</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹{shipping}</span>
                </div>

                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>₹{tax}</span>
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>

                <div className="text-sm text-muted-foreground pt-4">
                  <p>• Free shipping on orders over 299</p>
                  <p>• 30-days return policy</p>
                  <p>• Secure checkout with SSL encryption</p>
                </div>

              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  )
}

export default AddressForm
