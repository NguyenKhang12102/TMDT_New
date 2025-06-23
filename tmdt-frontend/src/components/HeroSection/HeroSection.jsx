import React from 'react';
import './HeroSection.css';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

const HeroSection = () => {
    return (
        <>
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-gray-100 to-white py-12">
                <div className="mx-16 grid md:grid-cols-2 gap-8 items-center px-4">
                    <div className="space-y-6">
                        <h1 className="text-3xl md:text-4xl font-bold">
                            Thiết kế của bạn,
                            <br />
                            in ấn hoàn hảo!
                        </h1>
                        <p className="text-gray-600">6,000+ khách hàng hài lòng</p>
                        <div className="flex gap-4">
                            <button className="rounded-full px-6 py-2 bg-black text-white hover:bg-gray-800 transition">
                                Thiết kế
                            </button>
                            <button className="rounded-full px-6 py-2 border border-black text-black hover:bg-gray-100 transition">
                                Sản phẩm
                            </button>

                        </div>
                    </div>
                    <div className="flex justify-center">
                        <div className="relative bg-gray-100 rounded-lg p-6">
                            <img
                                src="https://img.staticdj.com/c6d8abbb4916a5bf0f9708adfdfc4e0c_2560x.jpg?height=300&width=400"
                                alt="Ender-3 V3 KE 3D Printer"
                                width={400}
                                height={400}
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default HeroSection;
