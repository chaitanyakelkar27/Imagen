import React from 'react'
import { assets, plans } from '../assets/assets'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext.jsx'
import { motion } from 'framer-motion'

const BuyCredit = () => {
    const { user } = useContext(AppContext);
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className='min-h-[80vh] text-center pt-14 mb-10'>
                <motion.button
                    className='border border-gray-400 px-10 py-2 rounded-full mb-6'
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >Our Plans</motion.button>
                <motion.h1
                    className='text-center text-3xl font-medium mb-6 sm:mb-10'
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >Choose the plan</motion.h1>

                <div className='flex flex-wrap justify-center gap-6 text-left'>
                    {plans.map((item, index) => (
                        <motion.div
                            key={index}
                            className='bg-white drop-shadow-sm border rounded-lg py-12 px-8 text-gray-600'
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <img src={assets.logo_icon} alt="" width={40} />
                            <p className='mt-3 mb-1 font-semibold'>{item.id}</p>
                            <p className='text-sm'>{item.desc}</p>
                            <p className='mt-6'>
                                <span className='text-3xl font-medium'>${item.price}</span> / {item.credits} credits
                            </p>
                            <button className='w-full bg-gray-800 text-white mt-8 text-sm rounded-md py-2.5 min-w-52'>
                                {user ? 'Get Started' : 'Get Started'}
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}

export default BuyCredit