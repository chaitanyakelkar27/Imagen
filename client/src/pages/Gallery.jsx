import React, { useEffect, useContext, useState } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { use } from "react";

const Gallery = () => {
    const {
        fetchUserImages,
        images,
        selectedImages,
        setSelectedImages,
        deleteImage,
        deleteMultipleImages,
        toggleFavorite,
        token
    } = useContext(AppContext);

    const [filters, setFilters] = useState({
        page: 1,
        limit: 12,
        search: '',
        category: 'all',
        isFavorite: 'undefined',
        sortBy: 'createdAt',
        sortOrder: 'desc'
    });
    const [pagination, setPagination] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [searchInput, setSearchInput] = useState('');

    useEffect(() => {
        if (token) {
            loadImages();
        }
    }, [filters, token]);

    const loadImages = async () => {
        setIsLoading(true);
        const paginationData = await fetchUserImages(filters);
        setPagination(paginationData);
        setIsLoading(false);
    }

    const handleSearch = (e) => {
        e.preventDefault();
        setFilters({ ...filters, search: searchInput, page: 1 });
    };

    

    return (


    )
}

export default Gallery;