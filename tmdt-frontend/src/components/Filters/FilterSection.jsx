import React from "react";

const FilterSection = ({ title, options, selected, onChange, isOpen, onToggleOpen }) => {
    const handleClick = (option, e) => {
        e.stopPropagation();
        onChange(option);
    };

    return (
        <div className="mb-6">
            <div
                className="flex justify-between items-center cursor-pointer select-none"
                onClick={onToggleOpen}
            >
                <h6 className="font-semibold text-gray-800 text-xs md:text-xs">
                    {title}
                </h6>
                <span className="text-gray-600 text-xl font-bold select-none">
                    {isOpen ? "−" : "+"}
                </span>
            </div>

            {isOpen && (
                <ul className="mt-3 pl-5 space-y-2 text-gray-700 text-sm md:text-base">
                    {options.map((option) => (
                        <li
                            key={option}
                            onClick={(e) => handleClick(option, e)}
                            className={`cursor-pointer rounded px-2 py-1 transition-colors duration-200 ${
                                selected.includes(option)
                                    ? "font-semibold text-blue-600 bg-blue-50"
                                    : "hover:text-blue-500 hover:bg-blue-100"
                            }`}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FilterSection;
