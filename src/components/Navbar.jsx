import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext.jsx'

const Navbar = () => {
    const navigate = useNavigate();
    const { user } = useContext(AppContext);
    return (
        <div className='flex items-center justify-between py-4'>
            <Link to="/">
                <img src={assets.logo} alt="Logo" className="w-36 sm:w-44 lg:w-52 " />
            </Link>
            <div>
                {
                    user ?
                        <div className='flex items-center gap-5 sm:gap-10'>
                            <button onClick={() => navigate('/buy-credit')} className='flex items-center gap-2 bg-white px-4 py-2 rounded-full drop-shadow'>
                                <img className="w-5" src={assets.credit_star} alt="" />
                                <p className='text-xs sm:text-sm font-medium text-gray-600'> Credit left : 50</p>
                            </button>
                            <p className="text-gray-600 max-sm:hidden pl-4">Hi, Chaitanya</p>
                            <div className='relative group'>
                                <img src={assets.profile_icon} className='w-10 drop-shadow' alt="" />
                                <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-12'>
                                    <ul className='list-none m-0 p-2 bg-white border text-sm'>
                                        <li className='py-1 px-2 cursor-pointer pr-10'>Logout</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        :
                        <div className='flex items-center gap-2 sm:gap-5'>
                            <p onClick={() => navigate('/buy-credit')} className='cursor-pointer'>Pricing</p>
                            <button className='bg-zinc-800 text-white px-7 py-2 sm:px-10 text-sm rounded-full'>Login</button>
                        </div>
                }
            </div>
        </div>
    )
}

export default Navbar