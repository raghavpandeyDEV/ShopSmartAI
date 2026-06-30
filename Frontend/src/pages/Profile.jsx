import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import userLogo from "../assets/userlogo.jpg"
import { toast } from 'sonner'
import axios from "axios"
import { setUser } from "@/redux/userSlice"
import MyOrder from './MyOrder'

const Profile = () => {
  const { user } = useSelector(store => store.user)
  const params = useParams()
  const userId= user?._id

  const [updateUser, setUpdateUser] = useState({
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
    phoneNo : user?.phoneNo,
    address: user?.address,
    city: user?.city,
    zipCode: user?.zipCode,
    profilePic: user?.profilePic,
    role: user?.role,
  })

  const dispatch = useDispatch()
  const [file, setFile] = useState(null)

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
  e.preventDefault();

  const accessToken = localStorage.getItem("accessToken");

  try {
    let imageUrl = updateUser.profilePic; // default old image

    
    if (file) {
      const cloudForm = new FormData();
      cloudForm.append("file", file);
      cloudForm.append("upload_preset", "profile_upload");

      const cloudRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dlxshu1sb/image/upload",
        cloudForm
      );

      imageUrl = cloudRes.data.secure_url;
    }

    
    const res = await axios.put(
      `http://localhost:8000/api/v1/user/update/${userId}`,
      {
        firstName: updateUser.firstName,
        lastName: updateUser.lastName,
        email: updateUser.email,
        phoneNo: updateUser.phoneNo,
        address: updateUser.address,
        city: updateUser.city,
        zipCode: updateUser.zipCode,
        role: updateUser.role,
        profilePic: imageUrl, 
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (res.data.success) {
      toast.success(res.data.message);
      dispatch(setUser(res.data.user));
    }
  } catch (error) {
    console.log(error);
    toast.error("Failed to update Profile");
  }
};

  return (
    <div className="pt-30 min-h-screen bg-gray-100">
      <Tabs defaultValue="profile" className="max-w-7xl mx-auto items-center">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="flex flex-col justify-center items-center bg-gray-100">
            <h1 className="font-bold mb-7 text-2xl text-gray-800">
              Update Profile
            </h1>

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
                  <input
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
                      value={updateUser.firstName}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <Label>Last Name</Label>
                    <Input
                      name="lastName"
                      value={updateUser.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <Label>Email</Label>
                  <Input name="email" value={updateUser.email} disabled />
                </div>

                <div>
                  <Label>Phone</Label>
                  <Input
                    name="phoneNo"
                    value={updateUser.phoneNo}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label>Address</Label>
                  <Input
                    name="address"
                    value={updateUser.address}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label>City</Label>
                  <Input
                    name="city"
                    value={updateUser.city || ""}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label>Zip Code</Label>
                  <Input
                    name="zipCode"
                    value={updateUser.zipCode}
                    onChange={handleChange}
                  />
                </div>

                <Button type="submit" className="w-full mt-4 bg-pink-600 text-white">
                  Update Profile
                </Button>
              </form>

            </div>
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <MyOrder></MyOrder>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Profile