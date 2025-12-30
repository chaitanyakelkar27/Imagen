import React from 'react'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'

const Description = () => {
    return (
        <motion.div initial={{ opacity: 0, y: 50 }} transition={{ duration: 1 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className='flex flex-col items-center justify-center my-24 p-6 md:px-28 bg-gradient-to-r from-violet-50 via-fuchsia-50 to-pink-50 py-16 rounded-3xl'>
            <h1 className='text-3xl sm:text-4xl font-semibold mb-2'>Unleash Your Creativity</h1>
            <p className='text-gray-500 mb-8'>Bring your vision to life with AI-powered imagery</p>
            <div className='flex flex-col gap-5 md:gap-14 md:flex-row-reverse items-center'>
                <img src={assets.sample_img_1} alt="" className='w-80 xl:w-96 rounded-lg' />
                <div>
                    <h2 className='text-3xl font-medium max-w-lg mb-4'>Experience Next-Generation Visual Creation</h2>

                    <p className='text-gray-600 mb-4'>Our innovative AI platform makes it simple to transform your thoughts into captivating visuals. Whether you're crafting marketing materials, exploring artistic concepts, or designing unique graphics, our intelligent system converts your descriptions into beautiful imagery instantly.</p>

                    <p className='text-gray-600'>Just enter your creative prompt, and watch as our sophisticated AI engine produces professional-quality images within moments. From artistic illustrations to product mockups and beyond, you can visualize virtually anything you imagine. Harness the power of modern AI to unlock unlimited creative potential.</p>
                </div>
            </div>
        </motion.div>
    )
}

export default Description