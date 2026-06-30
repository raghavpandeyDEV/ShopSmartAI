import ImageUpload from '@/components/ImageUpload'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CardFooter } from '@/components/ui/card'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setProducts } from '@/redux/productSlice'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const AddProduct = () => {
 const accessToken=localStorage.getItem("accessToken")
 const {products}=useSelector(store=>store.product)
 const dispatch=useDispatch();
 const [loading , setLoading]=useState(false)
  const [productData , setProductData] = useState({
    productName : "",
    productPrice:0,
    productDesc:"",
    productImg:[],
    brand:"",
    category:""
  })

  const handleChange = (e)=>{
     const {name , value}=e.target
     setProductData((prev)=>({
      ...prev,
      [name]:value
     }))
  }
const submitHandler = async (e) => {
  e.preventDefault();

  try {
    if (productData.productImg.length === 0) {
      toast.error("Please select atleast one image");
      return;
    }

    setLoading(true);

    let imageUrls = [];

    // 🔥 Upload all images to Cloudinary
    for (let img of productData.productImg) {
      const cloudForm = new FormData();
      cloudForm.append("file", img);
      cloudForm.append("upload_preset", "profile_upload");

      const cloudRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dlxshu1sb/image/upload",
        cloudForm
      );

      imageUrls.push({
        url: cloudRes.data.secure_url,
      });
    }

    // 🔥 Send JSON to backend
    const res = await axios.post(
      `http://localhost:8000/api/v1/product/add`,
      {
        productName: productData.productName,
        productPrice: productData.productPrice,
        productDesc: productData.productDesc,
        category: productData.category,
        brand: productData.brand,
        productImg: imageUrls, // 👈 IMPORTANT
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (res.data.success) {
      dispatch(setProducts([...products, res.data.product]));
      toast.success("Product Added Successfully !!");
    }

  } catch (error) {
    console.log(error);
    toast.error("Failed to add product");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className='pl-[50px] pr-8 pt-30 pb-8 bg-gray-100 min-h-screen'>

      <Card className='w-290'>
        <CardHeader>
          <CardTitle>Add Product</CardTitle>
          <CardDescription>Enter Product details below</CardDescription>
        </CardHeader>

        <CardContent>
          <div className='flex flex-col gap-4'>

            {/* Product Name */}
            <div className='grid gap-2'>
              <Label>Product Name</Label>
              <Input type='text' name='productName'
              value={productData.productName}
              onChange={handleChange}
               placeholder='Ex-Iphone' required />
            </div>

            {/* Price */}
            <div className='grid gap-2'>
              <Label>Price</Label>
              <Input type='number' 
              value={productData.productPrice}
              onChange={handleChange}
              name='productPrice' required />
            </div>

            {/* Brand + Category */}
            <div className='grid grid-cols-2 gap-4'>

              <div className='grid gap-2'>
                <Label>Brand</Label>
                <Input type='text' name='brand' 
                value={productData.brand}
              onChange={handleChange}
                placeholder='Ex-apple' required />
              </div>

              <div className='grid gap-2'>
                <Label>Category</Label>
                <Input type='text' name='category' 
                value={productData.category}
              onChange={handleChange}
                placeholder='Ex-mobile' required />
              </div>

            </div>

            {/* Description */}
            <div className='grid gap-2'>
              <Label>Description</Label>
              <textarea
                name='productDesc'
                value={productData.desc}
              onChange={handleChange}
                placeholder='Enter brief description of product'
                className='border rounded-md p-2 outline-none min-h-[100px] resize-none w-full'
              />
            </div>
            <ImageUpload productData={productData}
             setProductData={setProductData}/>
          </div>
         <CardFooter className="flex-col gap-2">
  <Button disabled={loading} 
  onClick={submitHandler}
   className="w-full bg-pink-600 cursor-pointer" type="submit">
    {
      loading ? <span className='flex gap-1 items-center'><Loader2 className='animate-spin'/>Please wait </span> : 'Add Product'
    }
  </Button>
</CardFooter> 

        </CardContent>
      </Card>

    </div>
  )
}

export default AddProduct