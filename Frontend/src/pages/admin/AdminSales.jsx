import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { XAxis , YAxis, ResponsiveContainer , AreaChart, Tooltip , Area} from 'recharts'

const AdminSales = () => {
  const [stats , setStats]=useState({
    totalUsers:0,
    totalProducts:0,
    totalOrders:0,
    totalSales:0,
    salesByDate:[],
  })

  const fetchStats = async()=>{
    try {
      const accessToken=localStorage.getItem("accessToken")
      const res=await axios.get(`${import.meta.env.VITE_URL}/api/v1/orders/sales` , {
        headers : {
          Authorization : `Bearer ${accessToken}`
        }
      })

      if(res.data.success){
        setStats(res.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    fetchStats()
  },[])

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="p-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">

        <Card className="bg-pink-500 text-white shadow min-w-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Users</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-bold pt-0">
            {stats.totalUsers}
          </CardContent>
        </Card>

        <Card className="bg-pink-500 text-white shadow min-w-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Products</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-bold pt-0">
            {stats.totalProducts}
          </CardContent>
        </Card>

        <Card className="bg-pink-500 text-white shadow min-w-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Orders</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-bold pt-0">
            {stats.totalOrders}
          </CardContent>
        </Card>

        <Card className="bg-pink-500 text-white shadow min-w-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Sales</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-bold pt-0">
            ₹{stats.totalSales}
          </CardContent>
        </Card>

        <Card className="col-span-1 sm:col-span-2 lg:col-span-4 min-w-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Sales (Last 30 Days)</CardTitle>
          </CardHeader>

          <CardContent className="h-[180px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.sales}>
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} width={50} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#F472B6"
                  fill="#F472B6"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}

export default AdminSales