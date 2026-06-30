import React from 'react'
import { Outlet } from 'react-router-dom'

const Dashboard = () => {
  return (
    <div className="flex w-full max-w-full overflow-x-hidden">
      {/* Sidebar rendered by parent route — assuming it's fixed width ~280px (w-70/w-72) */}
      <main className="flex-1 min-w-0 pt-20 ml-[280px]">
        <Outlet />
      </main>
    </div>
  )
}

export default Dashboard