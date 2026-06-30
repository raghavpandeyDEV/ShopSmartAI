import React from 'react'
import { Button } from './ui/button'

const Hero = () => {
  return (
    <section className='relative bg-gradient-to-r from-blue-600 to-purple-600 text-white min-h-[520px]'>
      <div className='grid md:grid-cols-2 h-full min-h-[520px]'>

        {/* LEFT TEXT */}
        <div className='flex flex-col justify-center h-full px-10 md:px-16 lg:px-24 py-20'>
          <h1 className='text-5xl md:text-6xl font-bold leading-tight mb-6'>
            Latest Electronics <br /> at Best Prices
          </h1>
          <p className='text-lg md:text-xl text-blue-100 mb-8 max-w-lg'>
            Discover cutting-edge technology with unbeatable deals on
            smartphones, laptops and more.
          </p>
          <div className='flex flex-wrap gap-4'>
            <Button className='bg-white text-blue-600 hover:bg-gray-100'>
              Shop Now
            </Button>
            <Button
              variant='outline'
              className='border-white text-white hover:bg-white hover:text-blue-600 bg-transparent'
            >
              View Deals
            </Button>
          </div>
        </div>

        {/* RIGHT IMAGE — full bleed */}
        <div className='relative hidden md:block'>
          <img
            src='homepage.png'
            alt='electronics'
            className='absolute inset-0 w-full h-full object-cover'
          />
        </div>

      </div>
    </section>
  )
}

export default Hero