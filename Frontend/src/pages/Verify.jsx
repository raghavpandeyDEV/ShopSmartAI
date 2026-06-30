import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'

const Verify = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-sm w-full bg-white rounded-2xl shadow-md p-8 text-center">
        <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-green-500" />
        <h1 className="text-xl font-semibold mb-2">Account verified</h1>
        <p className="text-gray-500 text-sm mb-6">
          Your account has been successfully verified.
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-black text-white text-sm font-medium px-6 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          Go to Home
        </button>
      </div>
    </div>
  )
}

export default Verify