import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"
import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import userLogo from "../../assets/userlogo.jpg"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import axios from "axios"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"
import { setUser } from "@/redux/userSlice"

const UserInfo = () => {
  const navigate = useNavigate()
 const [updateUser, setUpdateUser] = useState({
  firstName: "",
  lastName: "",
  email: "",
  phoneNo: "",
  address: "",
  city: "",
  zipCode: "",
  role: "user"
})

 const[file,setFile]=useState(null)
 const {user}=useSelector(store=>store.user)
 const params = useParams()
const userId = params.userId
 const dispatch=useDispatch()

  const handleChange = (e) => {
    setUpdateUser({ ...updateUser, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)
    setUpdateUser({
      ...updateUser,
      profilePic: URL.createObjectURL(selectedFile),
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const accessToken = localStorage.getItem("accessToken")

    try {
      const formData = new FormData()

      formData.append("firstName", updateUser.firstName)
      formData.append("lastName", updateUser.lastName)
      formData.append("email", updateUser.email)
      formData.append("phoneNo", updateUser.phoneNo)
      formData.append("address", updateUser.address)
      formData.append("city", updateUser.city)
      formData.append("zipCode", updateUser.zipCode)
      formData.append("role", updateUser.role)

      if (file) {
        formData.append("file", file)
      }

      const res = await axios.put(
  `${import.meta.env.VITE_URL}/api/v1/user/update/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      if (res.data.success) {
        toast.success(res.data.message)
        dispatch(setUser(res.data.user))
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to update Profile")
    }
  }

  const getUserDetails = async()=>{
    try {
      const res= await axios.get(
  `${import.meta.env.VITE_URL}/api/v1/user/get-user/${userId}`)

      if(res.data.success){
        setUpdateUser(res.data.user)
      }
    } catch (error) {
      console.log(error)
    }
  }

   
  useEffect(()=>{
  if(userId){
    getUserDetails()
  }
}, [userId])

  return (
    <div className='pt-5 min-h-screen bg-gray-100'>
      <div className='max-w-7xl mx-auto'>
        <div className='flex flex-col justify-center items-center min-h-screen bg-gray-100'>
          
          <div className='flex justify-between gap-10'>
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft />
            </Button>

            <h1 className='font-bold mb-7 text-2xl text-gray-800'>
              Update Profile
            </h1>
          </div>
        <div className="w-full flex flex-col items-center justify-center gap- 6 px-7 max-w-2xl mx-auto">
              
              {/* profile picture */}
              <div className="flex flex-col items-center">
                <img
                  src={updateUser?.profilePic ? updateUser.profilePic : userLogo}
                  alt="profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-pink-800"
                  onError={(e) => (e.target.src = userLogo)}
                />

                <Label className="mt-4 cursor-pointer bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700">
                  Change Picture
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </Label>
              </div>

              {/* form */}
              <form
                onSubmit={handleSubmit}
                className="space-y-4 shadow-lg p-5 rounded-lg bg-white"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>First Name</Label>
                    <Input
                      name="firstName"
                      value={updateUser?.firstName || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <Label>Last Name</Label>
                    <Input
                      name="lastName"
                      value={updateUser?.lastName || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <Label>Email</Label>
                  <Input name="email" value={updateUser?.email || ""} disabled />
                </div>

                <div>
                  <Label>Phone</Label>
                  <Input
                    name="phoneNo"
                    value={updateUser?.phoneNo}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label>Address</Label>
                  <Input
                    name="address"
                    value={updateUser?.address || ""}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label>City</Label>
                  <Input
                    name="city"
                    value={updateUser?.city || ""}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label>Zip Code</Label>
                  <Input
                    name="zipCode"
                    value={updateUser?.zipCode || "" }
                    onChange={handleChange}
                  />
                </div>
                <div className="flex gap-3 items-center">
                  <Label className='block text-sm font-medium'>
                    Role : 
                  </Label>
          <RadioGroup
  value={updateUser?.role}
  onValueChange={(value) =>
    setUpdateUser((prev) => ({
      ...prev,
      role: value
    }))
  }
  className="flex items-center"
>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="user" id="user" />
    <Label htmlFor="user">User</Label>
  </div>

  <div className="flex items-center space-x-2">
    <RadioGroupItem value="admin" id="admin" />
    <Label htmlFor="admin">Admin</Label>
  </div>
</RadioGroup>
                </div>
         
                <Button type="submit" className="w-full mt-4 bg-pink-600 text-white">
                  Update Profile
                </Button>
              </form>

            </div>
        </div>
      </div>
    </div>
  )
}

export default UserInfo