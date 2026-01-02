import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {

    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [credits, setCredits] = useState(false);
    const [images, setImages] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const [imageStats, setImageStats] = useState(null);

    const loadCreditsData = async () => {
        try {
            if (!token) {
                return;
            }
            const { data } = await axios.post(`${backendURL}/api/user/credits`, {}, {
                headers: { token }
            });
            if (data.success) {
                setCredits(data.creditBalance);
                setUser(data.user);
            } else {
                console.error('Failed to load credits:', data.message);
                if (data.message.includes('token')) {
                    setToken(null);
                }
            }
        } catch (err) {
            console.error('Load credits error:', err);
            if (err.response?.status === 401) {
                setToken(null);
                toast.error('Session expired. Please login again.');
            }
        }
    }

    const navigate = useNavigate();

    const generateImage = async (prompt) => {
        try {
            const { data } = await axios.post(`${backendURL}/api/image/generate-image`, { prompt }, {
                headers: { token }
            });
            if (data.success) {
                setCredits(data.creditBalance);
                return data.image;
            } else {
                toast.error(data.message);
                if (data.creditBalance !== undefined) {
                    setCredits(data.creditBalance);
                }
                if (data.creditBalance === 0) {
                    navigate('/buy-credit');
                }
                return null;
            }
        } catch (err) {
            console.error('Generate image error:', err);
            const errorMessage = err.response?.data?.message || 'Failed to generate image.';
            toast.error(errorMessage);
            if (err.response?.status === 401) {
                setToken(null);
                toast.error('Session expired. Please login again.');
            }
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
            setCredits(false);
        }

    }, [token]);

    const fetchUserImages = async (filter = {}) => {
        try {
            if (!token) {
                toast.error('Please login to view gallery');
                return null;
            }

            const queryParams = new URLSearchParams(filter).toString();

            const { data } = await axios.get(
                `${backendURL}/api/image/user-images?${queryParams}`,
                {
                    headers: { token }
                }
            );

            if (data.success) {
                setImages(data.images);
                return data.pagination;
            } else {
                toast.error(data.message);
                return null;
            }
        } catch (error) {
            console.error('Fetch user images error:', error);
            toast.error('Failed to fetch images');
            if (error.response?.status === 401) {
                setToken(null);
                toast.error('Session expired. Please login again.');
            }
            return null;
        }
    };

    const deleteImage = async (imageId) => {
        try {
            const { data } = await axios.delete(
                `${backendURL}/api/image/delete/${imageId}`,
                {
                    headers: { token }
                }
            );
            if (data.success) {
                toast.success(data.message);
                return true;
            } else {
                toast.error(data.message);
                return false;
            }
        } catch (error) {
            console.error('Delete image error:', error);
            toast.error('Failed to delete image');
            if (error.response?.status === 401) {
                setToken(null);
                toast.error('Session expired. Please login again.');
            }
            return false;
        }
    };

    const deleteMultipleImages = async (imageIds) => {
        try {
            const { data } = await axios.post(
                `${backendURL}/api/image/delete-multiple`,
                { imageIds },
                {
                    headers: { token }
                }
            );
            if (data.success) {
                toast.success(data.message);
                return true;
            } else {
                toast.error(data.message);
                return false;
            }
        } catch (error) {
            console.error('Delete multiple images error:', error);
            toast.error('Failed to delete images');
            if (error.response?.status === 401) {
                setToken(null);
                toast.error('Session expired. Please login again.');
            }
            return false;
        }
    };

    const toggleFavorite = async (imageId) => {
        try {
            const { data } = await axios.patch(
                `${backendURL}/api/image/favorite/${imageId}`,
                {},
                { headers: { token } }
            );
            if (data.success) {
                toast.success(data.message);
                return data.isFavorite;
            } else {
                toast.error(data.message);
                return null;
            }
        } catch (error) {
            console.error('Toggle favorite error:', error);
            toast.error('Failed to toggle favorite');
            if (error.response?.status === 401) {
                setToken(null);
                toast.error('Session expired. Please login again.');
            }
            return null;
        }
    };

    const fetchImageStats = async () => {
        try {
            if (!token) {
                toast.error('Please login to view statistics');
                return;
            }
            const { data } = await axios.get(
                `${backendURL}/api/image/stats`,
                { headers: { token } }
            );
            if (data.success) {
                setImageStats(data.stats);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Fetch image stats error:', error);
            toast.error('Failed to fetch image statistics');
            if (error.response?.status === 401) {
                setToken(null);
                toast.error('Session expired. Please login again.');
            }
        }
    };

    const payCredits = async (planId) => {
        try {
            const { data } = await axios.post(`${backendURL}/api/user/pay-credits`,
                { planId },
                { headers: { token } }
            );
            if (data.success) {
                await loadCreditsData();
                return { success: true, creditsAdded: data.creditsAdded };
            } else {
                toast.error(data.message);
                return { success: false };
            }
        } catch (error) {
            console.error('Payment error:', error);
            toast.error(error.response?.data?.message || 'Payment failed');
            if (error.response?.status === 401) {
                setToken(null);
                toast.error('Session expired. Please login again.');
            }
            return { success: false };
        }
    };

    const value = {
        user, setUser,
        showLogin, setShowLogin,
        backendURL,
        token, setToken,
        credits, setCredits,
        loadCreditsData,
        logout,
        generateImage,
        images, setImages,
        selectedImages, setSelectedImages,
        imageStats, setImageStats,
        fetchUserImages,
        deleteImage,
        deleteMultipleImages,
        toggleFavorite,
        fetchImageStats,
        payCredits
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;