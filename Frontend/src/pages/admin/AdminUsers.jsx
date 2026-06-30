import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Input} from '@/components/ui/input'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

const AdminUsers = () => {
  const accessToken=localStorage.getItem("accessToken")
  const[users,setUsers]=useState([])
  const[searchTerm,setSearchTerm]=useState("")
   const navigate=useNavigate();


  const getAllUsers = async()=>{
    try {
      const res = await axios.get('http://localhost:8000/api/v1/user/all-user' ,
        {headers : {
          Authorization : `Bearer ${accessToken}`
        }}
      )
      
      if(res.data.success){
        setUsers(res.data.users)
      }
      
    } catch (error) {
      console.log(error)
    }
  }

  const filteredProducts = users.filter(user=>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

   useEffect(()=>{
  getAllUsers()
} , [])

  return (
    <div className='py-20 pr-20 pl-10 mx-auto px-4'>
  <h1 className='font-bold text-2xl'>User Management</h1>
  <p>View and manage registered users</p>

  <div className='flex relative w-[300px] mt-6'>
    <Search className='absolute left-2 top-1 text-gray-600 w-5' />
    <Input value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)}className='pl-10' placeholder='Search Users...' />
  </div>

  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 mt-7'>
    {
      filteredProducts.map((user, index) => {
        return (
          <div key={index} className='bg-pink-100 p-5 rounded-lg min-w-0'>
            
            <div className='flex items-center gap-3'>
              {user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt=''
                  className='rounded-full w-16 h-16 object-cover border border-pink-600 shrink-0'
                />
              ) : (
                <div className='rounded-full w-16 h-16 bg-pink-300 text-white flex items-center justify-center font-semibold text-lg border border-pink-600 shrink-0'>
                  {user.firstName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                </div>
              )}

              <div className='min-w-0'>
                <h1 className='font-semibold truncate'>
                  {user.firstName} {user.lastName}
                </h1>
                <h3 className='truncate'>{user.email}</h3>
              </div>
            </div>

            <div className='flex gap-3 mt-3' >
              <Button variant='outline' onClick={()=>navigate(`/dashboard/users/${user._id}`) }>Edit</Button>
             <Button
  onClick={() => {
    console.log("Clicked user:", user._id);
    navigate(`/dashboard/users/orders/${user._id}`);
  }}
>
  Show Order
</Button>
             
            </div>

          </div>
        )
      })
    }
  </div>
</div>
  )
}

export default AdminUsers