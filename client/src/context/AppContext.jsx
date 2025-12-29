import { createContext, useState } from "react";

export const AppContext = createContext();

export const AppContextProvider = (props) => {

    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [credits, setCredits] = useState(false);

    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const value = {
        user, setUser,
        showLogin, setShowLogin,
        backendURL,
        token, setToken,
        credits, setCredits
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;