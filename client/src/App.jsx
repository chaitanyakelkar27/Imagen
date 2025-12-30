import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import BuyCredit from './pages/BuyCredit'
import Result from './pages/Result'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Login from './components/Login'
import { AppContext } from './context/AppContext.jsx'
import { ToastContainer } from 'react-toastify';

const App = () => {
  const { showLogin } = React.useContext(AppContext);
  return (
    <div className='px-4 sm:px-6 md:px-8 lg:px-10 min-h-screen
     bg-linear-to-b from-slate-50 to-gray-100' >
      <ToastContainer position='bottom-right' />
      <Navbar />
      {showLogin && <Login />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/buy-credit" element={<BuyCredit />} />
        <Route path="/result" element={<Result />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App