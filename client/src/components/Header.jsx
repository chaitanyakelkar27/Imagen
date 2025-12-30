import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext.jsx'

const Header = () => {
    const navigate = useNavigate();
    const { user, setShowLogin } = useContext(AppContext);

    const onClickHandler = () => {
        if (user) {
            navigate('/result');
        } else {
            setShowLogin(true);
        }
    };

    return (
        <motion.div className="flex flex-col items-center justify-center"
            initial={{ opacity: 0, y: -50 }}
            transition={{ duration: 1 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}>

            <motion.div className='text-stone-500 inline-flex text-center gap-2
             bg-white px-6 py-1 rounded-full border border-neutral-500'
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}>
                <p>Advanced AI Image Creation Tool</p>
                <img src={assets.star_icon} alt="" />
            </motion.div>

            <motion.h1
                className='text-4xl max-w-75 sm:text-7xl sm:max-w-147.5 mx-auto mt-10 text-center'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}>
                Transform your <span className='text-purple-600'>ideas</span> into stunning visuals.
            </motion.h1>

            <motion.button onClick={onClickHandler}
                className='sm:text-lg text-white bg-black w-auto mt-8 px-12 py-2.5 flex items-center gap-2 rounded-full'
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}>
                Create Your Image
                <img className="h-6" src={assets.star_group} alt="" />
            </motion.button>

            <motion.div
                className='flex flex-wrap justify-center mt-16 gap-3'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 1 }}>
                {Array(6).fill('').map((item, index) => (
                    <motion.img
                        className='rounded hover:scale-105 transition-all duration-300 cursor-pointer max-sm:w-10'
                        src={index % 2 == 0 ? assets.sample_img_1 : assets.sample_img_2}
                        alt=""
                        key={index}
                        width={70}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }} />
                ))}
            </motion.div>
            <motion.p
                className="mt-2 text-neutral-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.8 }}>
                Generated Images from Imagen
            </motion.p>
        </motion.div>
    )
}

export default Header