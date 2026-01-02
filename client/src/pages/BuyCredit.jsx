import React, { useState } from 'react'
import { assets, plans } from '../assets/assets'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext.jsx'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'

const BuyCredit = () => {
    const { user, payCredits } = useContext(AppContext);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');

    const handlePlanClick = (plan) => {
        if (!user) {
            toast.error('Please login to purchase credits');
            return;
        }
        setSelectedPlan(plan);
        setShowPaymentModal(true);
    };

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        if (parts.length) {
            return parts.join(' ');
        } else {
            return value;
        }
    };

    const formatExpiry = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return v.substring(0, 2) + '/' + v.substring(2, 4);
        }
        return v;
    };

    const handlePayment = async (e) => {
        e.preventDefault();

        if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
            toast.error('Please enter a valid card number');
            return;
        }
        if (!expiry || expiry.length < 5) {
            toast.error('Please enter expiry date');
            return;
        }
        if (!cvv || cvv.length < 3) {
            toast.error('Please enter CVV');
            return;
        }

        setProcessing(true);

        const result = await payCredits(selectedPlan.id);

        if (result.success) {
            toast.success(`🎉 Payment successful! ${result.creditsAdded} credits added to your account`);
            setShowPaymentModal(false);
            setSelectedPlan(null);
            setCardNumber('');
            setExpiry('');
            setCvv('');
        }

        setProcessing(false);
    };
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
                            className='bg-white drop-shadow-sm border rounded-lg py-12 px-8 text-gray-600 hover:scale-105 transition-all'
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                        >
                            <img src={assets.logo_icon} alt="" width={40} />
                            <p className='mt-3 mb-1 font-semibold'>{item.id}</p>
                            <p className='text-sm'>{item.desc}</p>
                            <p className='mt-6'>
                                <span className='text-3xl font-medium'>${item.price}</span> / {item.credits} credits
                            </p>
                            <button
                                onClick={() => handlePlanClick(item)}
                                className='w-full bg-gray-800 text-white mt-8 text-sm rounded-md py-2.5 min-w-52 hover:bg-gray-900 transition-all'
                            >
                                {user ? 'Purchase' : 'Get Started'}
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {showPaymentModal && selectedPlan && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                        onClick={() => !processing && setShowPaymentModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
                        >
                            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Complete Payment</h2>

                            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-600">Plan:</span>
                                    <span className="font-semibold text-gray-800">{selectedPlan.id}</span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-600">Credits:</span>
                                    <span className="font-semibold text-gray-800">{selectedPlan.credits}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                                    <span className="text-gray-600">Amount:</span>
                                    <span className="text-2xl font-bold text-gray-800">${selectedPlan.price}</span>
                                </div>
                            </div>

                            <form onSubmit={handlePayment}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Card Number
                                    </label>
                                    <input
                                        type="text"
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                        placeholder="4242 4242 4242 4242"
                                        maxLength="19"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                                        disabled={processing}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Expiry Date
                                        </label>
                                        <input
                                            type="text"
                                            value={expiry}
                                            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                                            placeholder="MM/YY"
                                            maxLength="5"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                                            disabled={processing}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            CVV
                                        </label>
                                        <input
                                            type="text"
                                            value={cvv}
                                            onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, '').substring(0, 3))}
                                            placeholder="123"
                                            maxLength="3"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                                            disabled={processing}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowPaymentModal(false)}
                                        disabled={processing}
                                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? 'Processing...' : 'Pay Now'}
                                    </button>
                                </div>
                            </form>

                            <p className="text-xs text-gray-500 text-center mt-4">
                                Test mode: Use any card number
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export default BuyCredit