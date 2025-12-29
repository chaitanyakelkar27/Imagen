import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {

    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [credits, setCredits] = useState(false);

    const loadCreditsData = async () => {
        try {
            const { data } = await axios.post(`${backendURL}/api/user/credits`, {}, {
                headers: { token }
            });
            if (data.success) {
                setCredits(data.creditBalance);
                setUser(data.user);
            } else {
                toast.error('Failed to load credits data.');
            }
        } catch (err) {
            console.log(err);
            toast.error('Failed to load credits data.');
        }
    }

    const navigate = useNavigate();

    const generateImage = async (prompt) => {
        try {
            const { data } = await axios.post(`${backendURL}/api/image/generate-image`, { prompt }, {
                headers: { token }
            });
            if (data.success) {
                setCredits(data.creditsLeft);
                return data.image;
            } else {
                toast.error(data.message);
                loadCreditsData();
                if (data.creditBalance === 0) {
                    navigate('/buy-credit');
                }
                return null;
            }
        } catch (err) {
            console.log(err);
            toast.error(err.response?.data?.message || 'Failed to generate image.');
            return null;
        }
    }

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        toast.success('Logged out successfully');
    }

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            loadCreditsData();
        } else {
            localStorage.removeItem('token');
            setUser(null);
        }
    }, [token]);

    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const value = {
        user, setUser,
        showLogin, setShowLogin,
        backendURL,
        token, setToken,
        credits, setCredits,
        loadCreditsData,
        logout,
        generateImage
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;