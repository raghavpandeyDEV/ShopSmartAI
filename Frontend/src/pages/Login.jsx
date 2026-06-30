import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "sonner"
import { useDispatch } from "react-redux"
import { setUser } from "../redux/userSlice"


const Login = () => {
   const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  })
const navigate=useNavigate();
const dispatch = useDispatch()  

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const submitHandler = async(e) => {
    e.preventDefault()
    console.log(formData)
    try {
         setLoading(true);
       const res = await axios.post(
  `${import.meta.env.VITE_URL}/api/v1/user/login`,
  formData,
  {
    headers: {
      "Content-Type": "application/json"
    }
  }
)
        if(res.data.success){
          navigate('/')
          dispatch(setUser(res.data.user))
          localStorage.setItem("accessToken" , res.data.accessToken)
          toast.success(res.data.message)
        }
    } catch (error) {
        console.log(error) 
        toast.error(error.response.data.message)
    }
    finally{
      setLoading(false)
    }
  }

  
  return (
    <div className="flex justify-center items-center min-h-screen bg-pink-100">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Log Into Your Account</CardTitle>
          <CardDescription>
            Enter your account details to log into your account
          </CardDescription>
          
        </CardHeader>

       
        <form onSubmit={submitHandler}>
          <CardContent>
            <div className="flex flex-col gap-6">
             

              <div className="grid gap-2">
                <Label>Email</Label>
                <Input
                  name="email"
                  placeholder="m@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-2 relative">
                <Label>Password</Label>

                <Input
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"}
                />

                {showPassword ? (
                  <EyeOff
                    className="absolute right-3 top-9 cursor-pointer"
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <Eye
                    className="absolute right-3 top-9 cursor-pointer"
                    onClick={() => setShowPassword(true)}
                  />
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full cursor-pointer bg-pink-500 hover:bg-pink-400">
               {loading ? <><Loader2/></>:'Login'} 
            </Button>

            <p className="text-gray-700 text-sm">
              Don't have an account ?{" "}
              <Link to="/signup" className="text-pink-800 hover:underline">
              Signup
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default Login
