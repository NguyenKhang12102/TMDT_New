// File: Pagination.jsx
import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const handlePrev = () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
    };

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="mt-10 flex justify-center gap-2 flex-wrap items-center">
            <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-md border text-sm font-medium bg-white border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
                «
            </button>

            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-3 py-1.5 rounded-md font-medium border transition text-sm ${
                        currentPage === page
                            ? "bg-blue-700 text-white border-blue-700 shadow-lg"
                            : "bg-white border-gray-300 text-gray-800 hover:bg-blue-50 hover:border-blue-500"
                    }`}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-md border text-sm font-medium bg-white border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
                »
            </button>
        </div>
    );
};

export default Pagination;
