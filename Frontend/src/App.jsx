import { useState } from 'react'
import { Button } from './components/ui/button'
import { createBrowserRouter , RouterProvider } from 'react-router-dom'

import Login from './pages/Login'
import Signup from './pages/Signup'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Verify from './pages/Verify'
import Footer from './components/Footer'
import Profile from './pages/Profile'
import Products from './pages/Products'
import Cart from './pages/Cart'
import Dashboard from './pages/Dashboard'
import AdminSales from './pages/admin/AdminSales'
import AddProduct from './pages/admin/AddProduct'
import AdminProduct from './pages/admin/AdminProduct'
import AdminOrders from './pages/admin/AdminOrders'
import ShowUserOrders from './pages/admin/showUserOrders'
import AdminUsers from './pages/admin/AdminUsers'
import UserInfo from './pages/admin/UserInfo'
import ProtectedRoute from './components/ProtectedRoute'
import SingleProduct from './pages/SingleProduct'
import Sidebar from './components/Sidebar'
import AddressForm from './pages/AddressForm'
import OrderSuccess from './pages/OrderSuccess'

const router = createBrowserRouter([
  {
    path :'/',
    element:<><Navbar/><Home/><Footer/></>
  },
  {
    path :'/signup',
    element:<><Signup/></>
  },
  {
    path : '/login',
    element:<><Login/></>
  },
  {
    path: '/verify',
    element:<><Verify/></>
  },
  {
    path : '/profile/:id',
    element:<ProtectedRoute><Navbar/><Profile/></ProtectedRoute>
  },
  
  {
    path : '/products',
    element:<><Navbar/><Products/></>
  },
  {
    path : '/products/:id',
    element:<><Navbar/><SingleProduct/></>
  },
  {
    path : '/cart',
    element:<ProtectedRoute><Navbar/><Cart/></ProtectedRoute>
  },
  {
    path : '/address',
    element:<ProtectedRoute><AddressForm/></ProtectedRoute>
  },
   {
    path : '/order-success',
    element:<ProtectedRoute><OrderSuccess/></ProtectedRoute>
  },
  {
    path : '/dashboard',
    element:<ProtectedRoute adminOnly={true}><Sidebar/><Navbar/><Dashboard/></ProtectedRoute>,
    children : [
      {
        path : 'sales',
        element : <><AdminSales/></>
      },
      {
        path : 'add-product',
        element : <><AddProduct/></>
      },
      {
        path : 'products',
        element : <><AdminProduct/></>
      },
      {
        path : 'orders',
        element : <><AdminOrders/></>
      },
      {
        path : 'users/orders/:userId',
        element : <><ShowUserOrders/></>
      },
      {
        path : 'users',
        element : <><AdminUsers/></>
      },
      {
        path : 'users/:userId',
        element : <><UserInfo/></>
      }
    ]
  }

])
function App() {
 

  return (
  <>
  <RouterProvider router={router}/>
  </>
    
  )
}

export default App
