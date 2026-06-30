import { LayoutDashboard, PackagePlus, PackageSearch, User, Users } from 'lucide-react'
import React from 'react'
import { FaRegEdit } from 'react-icons/fa'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='hidden md:block fixed left-0 top-10 w-[300px] h-screen bg-pink-50 border-r border-pink-200 p-6'>
      
      <div className='pt-10 space-y-2'>

        <NavLink to='/dashboard/sales'
          className={({isActive}) => `text-xl ${isActive ? "bg-pink-600 text-gray-200" : "bg-transparent"} flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-full`}
        >
          <LayoutDashboard />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to='/dashboard/add-product'
          className={({isActive}) => `text-xl ${isActive ? "bg-pink-600 text-gray-200" : "bg-transparent"} flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-full`}
        >
          <PackagePlus />
          <span>Add Product</span>
        </NavLink>

        <NavLink to='/dashboard/products'
          className={({isActive}) => `text-xl ${isActive ? "bg-pink-600 text-gray-200" : "bg-transparent"} flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-full`}
        >
          <PackageSearch />
          <span>Products</span>
        </NavLink>

        <NavLink to='/dashboard/orders'
          className={({isActive}) => `text-xl ${isActive ? "bg-pink-600 text-gray-200" : "bg-transparent"} flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-full`}
        >
          <FaRegEdit />
          <span>Orders</span>
        </NavLink>

          <NavLink to='/dashboard/users'
          className={({isActive}) => `text-xl ${isActive ? "bg-pink-600 text-gray-200" : "bg-transparent"} flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-full`}
        >
          <Users/>
          <span>Users</span>
        </NavLink>

      </div>
    </div>
  )
}

export default Sidebar