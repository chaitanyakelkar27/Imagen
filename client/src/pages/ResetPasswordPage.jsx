import React, { useState, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext.jsx';
import { assets } from '../assets/assets.js';

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    const { backendURL, setShowLogin } = useContext(AppContext);

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!token) {
            setError('Missing or invalid reset token. Please request a new password reset link.');
            return;
        }

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            setIsSubmitting(true);
            const { data } = await axios.post(`${backendURL}/api/user/reset-password`, {
                token,
                newPassword
            });

            if (data.success) {
                toast.success(data.message);
                setShowLogin(true);
                navigate('/');
            } else {
                setError(data.message || 'Failed to reset password.');
                toast.error(data.message);
            }
        } catch (err) {
            console.error('Reset password error:', err);
            const message = err.response?.data?.message || 'Something went wrong. Please try again.';
            setError(message);
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100 max-w-md w-full">
                <div className="flex justify-center mb-6">
                    <img src={assets.logo} alt="Imagen Logo" className="w-36" />
                </div>

                <h1 className="text-2xl font-semibold text-center text-neutral-800 mb-2">Set New Password</h1>
                <p className="text-sm text-center text-gray-500 mb-6">
                    Please enter your new password below.
                </p>

                {error && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <div className="border px-4 py-2.5 flex items-center gap-2 rounded-xl focus-within:ring-2 focus-within:ring-blue-500">
                            <img src={assets.lock_icon} alt="" className="w-5 opacity-60" />
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="At least 8 characters"
                                className="outline-none text-sm w-full"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                        <div className="border px-4 py-2.5 flex items-center gap-2 rounded-xl focus-within:ring-2 focus-within:ring-blue-500">
                            <img src={assets.lock_icon} alt="" className="w-5 opacity-60" />
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Re-enter new password"
                                className="outline-none text-sm w-full"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium mt-4 hover:bg-blue-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
                    >
                        {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <button
                        onClick={() => navigate('/')}
                        className="text-sm text-gray-500 hover:text-gray-800 transition"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default ResetPasswordPage;

