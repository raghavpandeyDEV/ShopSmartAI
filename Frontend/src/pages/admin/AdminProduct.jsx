import React, { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Edit, Trash2, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useDispatch, useSelector } from 'react-redux'
import { Card } from '@/components/ui/card'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import { Textarea } from '@/components/ui/textarea'
import ImageUpload from '@/components/ImageUpload'
import { toast } from 'sonner'
import { setProducts } from '@/redux/productSlice'
import axios from 'axios'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"



const AdminProduct = () => {
 const products = useSelector(store => store.product.products)
 const [open ,setOpen]=useState(false)
const [editProduct , setEditProduct]=useState(null)
const[searchTerm , setSearchTerm]=useState("")
const accessToken=localStorage.getItem("accessToken")
const dispatch=useDispatch() 

const filteredProducts = products.filter((product) =>
  product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
  product.category.toLowerCase().includes(searchTerm.toLowerCase())
)

const handleChange = async(e)=>{
  const {name , value}=e.target
  setEditProduct(prev=>({
    ...prev,
    [name]: value
  }))
}

const handleSave = async (e) => {
  e.preventDefault();

  try {
    let imageUrls = [];

    const images = editProduct?.productImg || [];

    
    for (let img of images) {
      if (img instanceof File) {
        const cloudForm = new FormData();
        cloudForm.append("file", img);
        cloudForm.append("upload_preset", "profile_upload");

        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/dlxshu1sb/image/upload",
          cloudForm
        );

        imageUrls.push({
          url: res.data.secure_url,
        });
      } else {
        
        imageUrls.push(img);
      }
    }

   
    const res = await axios.put(
     `${import.meta.env.VITE_URL}/api/v1/product/update/${editProduct._id}`,
      {
        productName: editProduct.productName,
        productPrice: editProduct.productPrice,
        productDesc: editProduct.productDesc,
        category: editProduct.category,
        brand: editProduct.brand,
        productImg: imageUrls, // 
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (res.data.success) {
      toast.success("Product updated successfully");

      const updateProducts = products.map((p) =>
        p._id === editProduct._id ? res.data.product : p
      );

      dispatch(setProducts(updateProducts));
      setOpen(false);
    }
  } catch (error) {
    console.log(error);
    toast.error("Update failed");
  }
};

const deleteProductHandler = async(productId)=>{
  try {
    const remainingProducts=products.filter((product)=>product._id !==productId)
    const res = await axios.delete(
  `${import.meta.env.VITE_URL}/api/v1/product/delete/${productId}`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  }
)
    if(res.data.success){
      toast.success(res.data.message)
      dispatch(setProducts(remainingProducts))
    }
  } catch (error) {
    console.log(error)
  }
}


  return (
     <div className="py-10 px-10 min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">

        {/* Top bar */}
        <div className="flex items-center gap-6 mb-4 sticky top-0 z-10 bg-gray-100 py-3">

          {/* Search */}
          <div className="flex relative w-[300px] mt-2">
            <Search className="absolute left-2 top-2 text-gray-600 w-5" />
            <Input
              type="text"
              placeholder="Search Product..."
              className="pl-8"
              value={searchTerm}
              onChange={(e)=>setSearchTerm(e.target.value)}
            />
          </div>

          {/* Select */}
          <Select
            onValueChange={(value) => {
              if (value === "lowToHigh") {
                dispatch(setProducts([...products].sort((a, b) => a.productPrice - b.productPrice)))
              } else {
                dispatch(setProducts([...products].sort((a, b) => b.productPrice - a.productPrice)))
              }
            }}
          >
            <SelectTrigger className="w-[200px] bg-white">
              <SelectValue placeholder="Sort by Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lowToHigh">Price: Low to High</SelectItem>
              <SelectItem value="highToLow">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products List */}
        {
          filteredProducts?.map((product, index) => (
            <Card key={index} className="px-4 py-3">
              <div className='flex items-center justify-between gap-4'>

                <div className='flex gap-3 items-center min-w-0 flex-1'>
                  <img
                    src={product.productImg?.[0]?.url}
                    alt=""
                    className='w-20 h-20 object-cover rounded shrink-0'
                  />
                  <h1 className='font-bold text-gray-700 line-clamp-2'>
                    {product.productName}
                  </h1>
                </div>

                <h1 className='font-semibold text-gray-800 shrink-0 w-28 text-right'>
                  ₹{product.productPrice}
                </h1>

                <div className='flex gap-3 shrink-0'>
                  {/* ...rest unchanged... */}
                  <Dialog open={open} onOpenChange={setOpen}>
      
        <DialogTrigger asChild>
          <Edit onClick={()=>{setOpen(true) , setEditProduct(product)}} className='text-green-500 cursor-pointer'/>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[625px] max-h-[740px] overflow-y-scroll">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Make changes to your Product here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className = "flex flex-col gap-2">
            <Field className='grid gap-2'>
              <Label>Product Name</Label>
              <Input 
              type='text'
              value={editProduct?.productName}
              onChange = {handleChange}
              name="productName" 
              placeholder="Ex : iPhone"
              required />
            </Field>

            <Field className="grid gap-2">
              <Label>Price</Label>
              <Input 
              type='number'
              value={editProduct?.productPrice}
              onChange = {handleChange}
              name="productPrice" 
              required 
              />
            </Field>

            <Field className= "grid gap-2">
              <Label>Brand</Label>
              <Input 
              type='text'
              name="brand" 
              value={editProduct?.brand}
              onChange = {handleChange}
              placeholder="Ex : Apple"
              required 
              />
            </Field>
            
             <Field className= "grid gap-2">
              <Label>Category</Label>
              <Input 
              type='text'
              value={editProduct?.category}
              onChange = {handleChange}
              name="category" 
              placeholder="Ex : Mobile"
              required 
              />
            </Field>

            <Field className= "grid gap-2">
              <Label>Description</Label>
             <Textarea name="productDesc" 
             value={editProduct?.productDesc}
              onChange = {handleChange}
             placeholder="Enter brief description of product"></Textarea>
            </Field>

            <div>
              <ImageUpload productData={editProduct} setProductData={setEditProduct}/>
            </div>

          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSave}type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      
    </Dialog>
                  
                  <AlertDialog>
  <AlertDialogTrigger><Trash2 className='text-red-500 cursor-pointer'/></AlertDialogTrigger>

  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your product.
      </AlertDialogDescription>
    </AlertDialogHeader>

    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={()=>deleteProductHandler(product._id)}>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

                  
                </div>

              </div>
            </Card>
          ))
        }

      </div>
    </div>
  )
}

export default AdminProduct