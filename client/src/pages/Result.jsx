import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'

const Result = () => {
    const [image, setImage] = useState(assets.sample_img_1);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState('');

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (input) {
            const loadingBar = document.querySelector('.loading-bar');
            if (loadingBar) {
                loadingBar.style.width = '0%';
                setTimeout(() => {
                    loadingBar.style.width = '100%';
                }, 100);
            }
            setTimeout(() => {
                setIsImageLoaded(true);
                setIsLoading(false);
            }, 10000);
        }
    };

    const handleGenerateAnother = () => {
        setIsImageLoaded(false);
        setInput('');
        setImage(assets.sample_img_1);
    };

    return (
        <motion.form
            onSubmit={onSubmitHandler}
            className='flex flex-col min-h-[90vh] justify-center items-center'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
            >
                <div className='relative'>
                    <img src={image} alt="" className='max-w-sm rounded' />
                    <span className={`loading-bar absolute bottom-0 left-0 h-1 bg-blue-500 transition-all duration-[10s] ${isLoading ? 'w-full' : 'w-0'}`} />
                </div>
                <p className={`text-center mt-2 ${isLoading ? 'block' : 'hidden'}`}>Loading.....</p>
            </motion.div>

            {!isImageLoaded &&
                <motion.div
                    className='flex w-full max-w-xl bg-neutral-500 text-white text-sm p-0.5 mt-10 rounded-full'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <input
                        onChange={(e) => setInput(e.target.value)}
                        value={input}
                        type="text"
                        placeholder='Describe what you want to generate'
                        className='flex-1 bg-transparent outline-none ml-8 max-sm:w-20 placeholder-gray-400'
                        required
                    />
                    <button type='submit'
                        className='bg-zinc-900 px-10 sm:px-16 py-3 rounded-full hover:bg-zinc-800 transition-all'>
                        Generate
                    </button>
                </motion.div>
            }

            {isImageLoaded &&
                <motion.div
                    className='flex gap-2 flex-wrap justify-center text-white text-sm p-0.5 mt-10 rounded-full'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <p onClick={handleGenerateAnother} className='bg-transparent border border-zinc-900 text-black px-8 py-3 rounded-full cursor-pointer hover:bg-gray-100 transition-all'>
                        Generate Another
                    </p>
                    <a href={image} download className='bg-zinc-900 px-10 py-3 rounded-full cursor-pointer hover:bg-zinc-800 transition-all'>
                        Download
                    </a>
                </motion.div>
            }
        </motion.form>
    )
}

export default Result