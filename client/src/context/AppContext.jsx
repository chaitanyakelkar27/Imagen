import axios from "axios";
import { createContext, useEffect, useState } from "react";
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
        logout
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;