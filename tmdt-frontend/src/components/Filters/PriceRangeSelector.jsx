import React from "react";

const PriceRangeSelector = ({ currentMin, currentMax, onChange }) => {
    const presetRanges = [
        { label: "< 5 triệu", min: 0, max: 5000000 },
        { label: "5 - 10 triệu", min: 5000000, max: 10000000 },
        { label: "10 - 20 triệu", min: 10000000, max: 20000000 },
        { label: "> 20 triệu", min: 20000000, max: 30000000 },
    ];

    const isActive = (preset) =>
        preset.min === currentMin && preset.max === currentMax;

    return (
        <div className="space-y-4">
            <div className="text-sm font-medium text-gray-700">Khoảng giá đang chọn:</div>

            <div className="text-lg font-bold text-blue-800">
                {currentMin.toLocaleString("vi-VN")}₫ - {currentMax.toLocaleString("vi-VN")}₫
            </div>

            <div className="grid grid-cols-2 gap-3">
                {presetRanges.map((preset, idx) => (
                    <button
                        key={idx}
                        onClick={() => onChange({ currentMin: preset.min, currentMax: preset.max })}
                        className={`px-4 py-2 rounded-md border text-sm font-medium transition duration-200 ${
                            isActive(preset)
                                ? "bg-blue-800 text-white border-blue-800"
                                : "bg-white text-gray-800 border-gray-300 hover:bg-blue-50 hover:border-blue-500"
                        }`}
                    >
                        {preset.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PriceRangeSelector;
