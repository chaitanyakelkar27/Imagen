import React, { useState, useContext, useEffect } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { motion } from 'framer-motion'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {
    const [state, setState] = useState('Login');
    const { setShowLogin, backendURL, setToken, setUser } = useContext(AppContext);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            if (state === 'Login') {
                const { data } = await axios.post(`${backendURL}/api/user/login`, {
                    email,
                    password
                });
                if (data.success) {
                    setToken(data.token);
                    setShowLogin(false);
                    setUser(data.user);
                    toast.success('Login Successful');
                } else {
                    toast.error(data.message);
                }
            } else {
                const { data } = await axios.post(`${backendURL}/api/user/register`, {
                    name,
                    email,
                    password
                });
                if (data.success) {
                    setToken(data.token);
                    setShowLogin(false);
                    setUser(data.user);
                    toast.success('Account Created Successfully');
                } else {
                    toast.error(data.message);
                }
            }

        } catch (error) {
            toast.error('Something went wrong. Please try again.');
        }
    };

    const handleGoogleLogin = () => {
        window.open(`${backendURL}/api/user/google`, "_self");

    };

    return (
        <motion.div
            className='fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <motion.form onSubmit={onSubmitHandler} className='relative bg-white p-10 rounded-xl text-slate-500'>
                <h1 className='text-center text-2xl text-neutral-700 font-medium'>{state}</h1>
                <p className='text-sm text-center mb-5'>Welcome back! Please sign in to continue</p>

                {state !== 'Login' && (
                    <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-5'>
                        <img src={assets.user_icon} alt="" width={20} />
                        <input onChange={(e) => setName(e.target.value)} value={name} className='outline-none text-sm' type="text" placeholder='Full Name' required />
                    </div>
                )}

                <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
                    <img src={assets.email_icon} alt="" />
                    <input onChange={(e) => setEmail(e.target.value)} value={email} className='outline-none text-sm' type="email" placeholder='Email id' required />
                </div>

                <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
                    <img src={assets.lock_icon} alt="" />
                    <input onChange={(e) => setPassword(e.target.value)} value={password} className='outline-none text-sm' type="password" placeholder='Password' required />
                </div>

                <p className='text-sm text-blue-600 my-4 cursor-pointer'>Forgot password?</p>

                <button type='submit' className='bg-blue-600 w-full text-white py-2 rounded-full'>
                    {state === 'Login' ? 'login' : 'create account'}
                </button>

                <div className='mt-4'>
                    <div className='relative flex items-center justify-center my-4'>
                        <div className='border-t border-gray-300 grow'></div>
                        <span className='px-4 text-sm text-gray-500'>or</span>
                        <div className='border-t border-gray-300 grow'></div>
                    </div>

                    <button
                        type='button'
                        onClick={handleGoogleLogin}
                        className='w-full border border-gray-300 rounded-full py-2 px-4 flex items-center justify-center gap-3 hover:bg-gray-50 transition'
                    >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19.8055 10.2292C19.8055 9.55138 19.7508 8.86667 19.6344 8.19583H10.2002V12.0492H15.6014C15.3773 13.2911 14.6571 14.3898 13.6025 15.0875V17.5866H16.8251C18.7192 15.8449 19.8055 13.2728 19.8055 10.2292Z" fill="#4285F4" />
                            <path d="M10.2002 20.0006C12.9527 20.0006 15.2736 19.1048 16.8251 17.5865L13.6025 15.0875C12.7026 15.6979 11.5518 16.0433 10.2002 16.0433C7.5464 16.0433 5.28716 14.2834 4.48723 11.9168H1.16406V14.4921C2.75182 17.6593 6.3092 20.0006 10.2002 20.0006Z" fill="#34A853" />
                            <path d="M4.48723 11.9168C4.03158 10.6749 4.03158 9.32677 4.48723 8.08479V5.50952H1.16406C-0.354167 8.53701 -0.354167 12.4646 1.16406 15.4921L4.48723 11.9168Z" fill="#FBBC04" />
                            <path d="M10.2002 3.95819C11.6244 3.93605 13.0011 4.47632 14.0368 5.45632L16.8978 2.60085C15.1826 0.990854 12.9324 0.118854 10.2002 0.143854C6.3092 0.143854 2.75182 2.48518 1.16406 5.50951L4.48723 8.08478C5.28716 5.71823 7.5464 3.95819 10.2002 3.95819Z" fill="#EA4335" />
                        </svg>
                        <span className='text-sm font-medium text-gray-700'>Continue with Google</span>
                    </button>
                </div>

                {state === 'Login' ? (
                    <p className='mt-5 text-center'>Don't have an account? <span className='text-blue-600 cursor-pointer' onClick={() => setState('Sign Up')}>Sign up</span></p>
                ) : (
                    <p className='mt-5 text-center'>Already have an account? <span className='text-blue-600 cursor-pointer' onClick={() => setState('Login')}>Login</span></p>
                )}

                <img onClick={() => setShowLogin(false)} src={assets.cross_icon} className='absolute top-5 right-5 cursor-pointer' alt="" />
            </motion.form>
        </motion.div>
    )
}

export default Login