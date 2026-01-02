import React, { useEffect, useContext, useState } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { assets } from "../assets/assets.js";

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
        isFavorite: '',
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
        if (paginationData) {
            setPagination(paginationData);
        }
        setIsLoading(false);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setFilters({ ...filters, search: searchInput, page: 1 });
    };

    const handleSelectImage = (imageId) => {
        setSelectedImages(prev =>
            prev.includes(imageId)
                ? prev.filter(id => id !== imageId)
                : [...prev, imageId]
        );
    };

    const handleSelectAll = () => {
        if (selectedImages.length === images.length && images.length > 0) {
            setSelectedImages([]);
        } else {
            setSelectedImages(images.map(img => img._id));
        }
    };

    const handleDeleteSelected = async () => {
        if (selectedImages.length === 0) return;

        if (window.confirm(`Delete ${selectedImages.length} image(s)?`)) {
            const success = await deleteMultipleImages(selectedImages);
            if (success) {
                setSelectedImages([]);
                loadImages();
            }
        }
    };

    const handleDeleteSingle = async (imageId, e) => {
        e.stopPropagation();
        if (window.confirm('Delete this image?')) {
            const success = await deleteImage(imageId);
            if (success) loadImages();
        }
    };

    const handleToggleFavorite = async (imageId, e) => {
        e.stopPropagation();
        await toggleFavorite(imageId);
        loadImages();
    };

    const handleDownload = (imageUrl, prompt, e) => {
        e.stopPropagation();
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `${prompt.substring(0, 30).replace(/[^a-z0-9]/gi, '_')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePageChange = (newPage) => {
        setFilters({ ...filters, page: newPage });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (!token) {
        return (
            <motion.div
                className="flex flex-col items-center justify-center min-h-screen text-center px-6 sm:px-10"
                initial={{ opacity: 0.2, y: 100 }}
                transition={{ duration: 1 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <img src={assets.logo} alt="Logo" className="w-28 mb-8" />
                <h1 className="text-4xl sm:text-5xl font-semibold max-w-2xl text-neutral-800 mb-4">
                    Access Your Gallery
                </h1>
                <p className="text-gray-600 text-lg mb-8">
                    Please login to view your generated images
                </p>
                <button
                    onClick={() => window.location.href = '/'}
                    className="sm:text-lg text-white bg-black w-auto mt-8 px-12 py-3 flex items-center gap-2 rounded-full"
                >
                    <img src={assets.star_icon} alt="Star" className="w-6" />
                    Go to Home
                </button>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="flex flex-col items-center justify-center min-h-screen px-6 sm:px-10 py-10"
            initial={{ opacity: 0.2, y: 100 }}
            transition={{ duration: 1 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
        >
            <div className="text-center mb-10">
                <motion.h1
                    className="text-4xl sm:text-5xl font-semibold max-w-2xl text-neutral-800"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    My Gallery
                </motion.h1>
                <motion.p
                    className="text-gray-600 mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    {pagination.totalImages || 0} image{pagination.totalImages !== 1 ? 's' : ''} generated
                </motion.p>
            </div>

            <motion.div
                className="w-full max-w-7xl bg-white rounded-2xl shadow-lg p-6 mb-6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
            >
                <form onSubmit={handleSearch} className="mb-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 relative">
                            <img src={assets.search_icon} alt="Search" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 opacity-50" />
                            <input
                                type="text"
                                placeholder="Search by prompt..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-8 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white rounded-lg hover:scale-105 transition-all"
                        >
                            Search
                        </button>
                        {filters.search && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchInput('');
                                    setFilters({ ...filters, search: '', page: 1 });
                                }}
                                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </form>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    <select
                        value={filters.category}
                        onChange={(e) => setFilters({ ...filters, category: e.target.value, page: 1 })}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                        <option value="all">All Categories</option>
                        <option value="portrait">Portrait</option>
                        <option value="landscape">Landscape</option>
                        <option value="abstract">Abstract</option>
                        <option value="animals">Animals</option>
                        <option value="architecture">Architecture</option>
                        <option value="other">Other</option>
                    </select>

                    <select
                        value={filters.isFavorite}
                        onChange={(e) => setFilters({ ...filters, isFavorite: e.target.value, page: 1 })}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                        <option value="">All Images</option>
                        <option value="true">Favorites Only</option>
                    </select>

                    <select
                        value={filters.sortBy}
                        onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                        <option value="createdAt">Sort: Date</option>
                        <option value="prompt">Sort: Prompt</option>
                    </select>

                    <select
                        value={filters.sortOrder}
                        onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value })}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                        <option value="desc">Newest First</option>
                        <option value="asc">Oldest First</option>
                    </select>
                </div>
            </motion.div>

            <AnimatePresence>
                {selectedImages.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full max-w-7xl bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-4 mb-6 flex flex-wrap justify-between items-center gap-4 shadow-lg"
                    >
                        <span className="font-semibold text-lg">
                            {selectedImages.length} image(s) selected
                        </span>
                        <div className="flex gap-3">
                            <button
                                onClick={handleDeleteSelected}
                                className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium flex items-center gap-2"
                            >
                                <img src={assets.trash_icon} alt="" className="w-4" />
                                Delete Selected
                            </button>
                            <button
                                onClick={() => setSelectedImages([])}
                                className="px-5 py-2 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition font-medium"
                            >
                                Clear
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {images.length > 0 && (
                <div className="w-full max-w-7xl mb-4">
                    <label className="flex items-center gap-2 cursor-pointer w-fit hover:text-blue-600 transition">
                        <input
                            type="checkbox"
                            checked={selectedImages.length === images.length && images.length > 0}
                            onChange={handleSelectAll}
                            className="w-5 h-5 cursor-pointer accent-blue-600"
                        />
                        <span className="text-sm font-medium text-gray-700">Select all on this page</span>
                    </label>
                </div>
            )}

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32">
                    <img src={assets.loading_icon} alt="Loading" className="w-20 animate-spin" />
                    <p className="mt-6 text-gray-600 text-lg">Loading your images...</p>
                </div>
            ) : images.length === 0 ? (
                <motion.div
                    className="flex flex-col items-center justify-center py-32 text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <img src={assets.logo} alt="No images" className="w-32 mb-6 opacity-50" />
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">No images found</h2>
                    <p className="text-gray-600 mb-8">
                        {filters.search ? 'Try a different search term' : 'Start generating images to see them here'}
                    </p>
                    <button
                        onClick={() => window.location.href = '/result'}
                        className="bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white px-8 py-3 rounded-full hover:scale-105 transition-all flex items-center gap-2"
                    >
                        <img src={assets.star_icon} alt="Generate" className="w-5" />
                        Generate Images
                    </button>
                </motion.div>
            ) : (
                <>
                    <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
                        {images.map((image, index) => (
                            <motion.div
                                key={image._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="relative bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedImages.includes(image._id)}
                                    onChange={() => handleSelectImage(image._id)}
                                    onClick={(e) => e.stopPropagation()}
                                    className="absolute top-3 left-3 w-5 h-5 z-20 cursor-pointer accent-blue-600"
                                />

                                <button
                                    onClick={(e) => handleToggleFavorite(image._id, e)}
                                    className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:scale-110 transition-transform"
                                >
                                    <img
                                        src={image.isFavorite ? assets.heart_filled_icon : assets.heart_icon}
                                        alt="Favorite"
                                        className="w-5 h-5"
                                    />
                                </button>

                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={image.imageUrl}
                                        alt={image.prompt}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-4 gap-3">
                                        <button
                                            onClick={(e) => handleDownload(image.imageUrl, image.prompt, e)}
                                            className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-all hover:scale-110 shadow-lg"
                                            title="Download"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                        </button>

                                        <button
                                            onClick={(e) => handleDeleteSingle(image._id, e)}
                                            className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-all hover:scale-110 shadow-lg"
                                            title="Delete"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="p-4">
                                    <p className="text-sm text-gray-700 line-clamp-2 mb-3 font-medium" title={image.prompt}>
                                        {image.prompt}
                                    </p>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="bg-gradient-to-r from-violet-100 to-fuchsia-100 text-violet-700 px-3 py-1 rounded-full font-medium">
                                            {image.category}
                                        </span>
                                        <span className="text-gray-500">
                                            {new Date(image.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {pagination.totalPages > 1 && (
                        <motion.div
                            className="flex flex-col items-center gap-6 pb-10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <div className="flex items-center gap-2 flex-wrap justify-center">
                                <button
                                    disabled={!pagination.hasPrevPage}
                                    onClick={() => handlePageChange(1)}
                                    className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition shadow-sm"
                                >
                                    «
                                </button>

                                <button
                                    disabled={!pagination.hasPrevPage}
                                    onClick={() => handlePageChange(filters.page - 1)}
                                    className="px-5 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition shadow-lg"
                                >
                                    Previous
                                </button>

                                <span className="px-6 py-2 bg-white border border-gray-300 rounded-lg shadow-sm font-medium">
                                    Page <strong className="text-violet-600">{filters.page}</strong> of <strong className="text-violet-600">{pagination.totalPages}</strong>
                                </span>

                                <button
                                    disabled={!pagination.hasNextPage}
                                    onClick={() => handlePageChange(filters.page + 1)}
                                    className="px-5 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition shadow-lg"
                                >
                                    Next
                                </button>

                                <button
                                    disabled={!pagination.hasNextPage}
                                    onClick={() => handlePageChange(pagination.totalPages)}
                                    className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition shadow-sm"
                                >
                                    »
                                </button>
                            </div>

                            <p className="text-sm text-gray-600">
                                Showing {((filters.page - 1) * filters.limit) + 1} - {Math.min(filters.page * filters.limit, pagination.totalImages)} of {pagination.totalImages} images
                            </p>
                        </motion.div>
                    )}
                </>
            )}
        </motion.div>
    );
};

export default Gallery;