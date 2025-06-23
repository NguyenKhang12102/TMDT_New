import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const API_BASE_URL = 'http://localhost:8080/api/admin/statistics'; // Replace with your backend URL

// Currency formatter
const currencyFormatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
});

const Dashboard = () => {
    const [revenueByTimeData, setRevenueByTimeData] = useState([]);
    const [revenueByCategoryData, setRevenueByCategoryData] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Current month
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Current year
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPeriod, setSelectedPeriod] = useState('monthly'); // 'monthly', 'yearly', 'daily'
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]); // Current date in YYYY-MM-DD format
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]); // Current date in YYYY-MM-DD format

    const getToken = () => {
        // Replace with your actual token retrieval logic (e.g., from localStorage)
        return localStorage.getItem('authToken');
    };

    const fetchRevenueData = async () => {
        setLoading(true);
        setError(null);
        const token = getToken();
        if (!token) {
            setError('Authentication token not found. Please log in.');
            setLoading(false);
            return;
        }

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            let revenueTimeUrl = `${API_BASE_URL}/revenue-by-time`;

            if (selectedPeriod === 'monthly') {
                revenueTimeUrl += `?period=monthly`;
            } else if (selectedPeriod === 'yearly') {
                revenueTimeUrl += `?period=yearly`;
            } else if (selectedPeriod === 'daily') {
                if (startDate && endDate) {
                    revenueTimeUrl += `?period=daily&startDate=${startDate}&endDate=${endDate}`;
                } else {
                    setError('Please select both start and end dates for daily view.');
                    setLoading(false);
                    return;
                }
            }
            // Fetch Revenue By Time
            const revenueTimeResponse = await axios.get(revenueTimeUrl, config);
            setRevenueByTimeData(revenueTimeResponse.data);

            // Fetch Revenue By Category for selected month
            const revenueCategoryResponse = await axios.get(`${API_BASE_URL}/revenue-by-category?year=${selectedYear}&month=${selectedMonth}`, config);
            setRevenueByCategoryData(revenueCategoryResponse.data);

            // Fetch Total Revenue
            const totalRevenueResponse = await axios.get(`${API_BASE_URL}/total-revenue`, config);
            setTotalRevenue(totalRevenueResponse.data);

        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError('Failed to fetch dashboard data. Please check your network or token.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRevenueData();
    }, [selectedMonth, selectedYear, selectedPeriod, startDate, endDate]);

    const handleMonthChange = (e) => {
        setSelectedMonth(parseInt(e.target.value));
    };

    const handleYearChange = (e) => {
        setSelectedYear(parseInt(e.target.value));
    };

    const handlePeriodChange = (e) => {
        setSelectedPeriod(e.target.value);
    };

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    // Prepare data for Bar Chart (Revenue by Time)
    const barChartData = {
        labels: revenueByTimeData.map(data => data.period),
        datasets: [
            {
                label: 'Revenue',
                data: revenueByTimeData.map(data => data.revenue),
                backgroundColor: 'rgba(75, 192, 192, 0.8)', // Softer color
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                borderRadius: 5, // Rounded bars
            },
        ],
    };

    const barChartOptions = {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += currencyFormatter.format(context.parsed.y);
                        }
                        return label;
                    }
                },
                backgroundColor: 'rgba(0,0,0,0.7)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: '#fff',
                borderWidth: 1,
                cornerRadius: 5,
            },
            title: {
                display: true,
                text: 'Revenue by Time',
                font: {
                    size: 18,
                    weight: 'bold',
                },
                color: '#333',
            },
            legend: {
                display: true,
                labels: {
                    color: '#555',
                },
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#555',
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(200, 200, 200, 0.2)',
                },
                ticks: {
                    color: '#555',
                    callback: function(value) {
                        return currencyFormatter.format(value);
                    }
                },
            },
        },
    };

    // Prepare data for Pie Chart (Revenue by Category)
    const pieChartData = {
        labels: revenueByCategoryData.map(data => data.categoryName),
        datasets: [
            {
                label: 'Revenue by Category',
                data: revenueByCategoryData.map(data => data.revenue),
                backgroundColor: [
                    'rgba(255, 159, 64, 0.8)', // Orange
                    'rgba(54, 162, 235, 0.8)',  // Blue
                    'rgba(255, 99, 132, 0.8)',  // Red
                    'rgba(75, 192, 192, 0.8)',  // Green
                    'rgba(153, 102, 255, 0.8)', // Purple
                    'rgba(255, 206, 86, 0.8)',  // Yellow
                ],
                borderColor: [
                    'rgba(255, 159, 64, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 206, 86, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const pieChartOptions = {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed !== null) {
                            label += currencyFormatter.format(context.parsed);
                        }
                        return label;
                    }
                },
                backgroundColor: 'rgba(0,0,0,0.7)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: '#fff',
                borderWidth: 1,
                cornerRadius: 5,
            },
            title: {
                display: true,
                text: 'Revenue by Category',
                font: {
                    size: 18,
                    weight: 'bold',
                },
                color: '#333',
            },
            legend: {
                position: 'right', // Position legend to the right
                labels: {
                    color: '#555',
                },
            },
        },
    };

    if (loading) return <div className="flex justify-center items-center h-screen text-xl font-semibold">Loading dashboard data...</div>;
    if (error) return <div className="flex justify-center items-center h-screen text-xl font-semibold text-red-600">Error: {error}</div>;

    const months = Array.from({ length: 12 }, (item, i) => i + 1);
    const years = Array.from({ length: 5 }, (item, i) => new Date().getFullYear() - 2 + i); // Current year +/- 2

    return (
        <div className="dashboard-container p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-extrabold mb-8 text-gray-800 border-b-2 border-indigo-500 pb-2">Admin Dashboard</h1>

            <div className="stats-summary grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-start">
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Total Revenue</h2>
                    <p className="text-4xl font-bold text-green-600">{currencyFormatter.format(totalRevenue)}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-start">
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Orders This Month</h2>
                    <p className="text-4xl font-bold text-blue-600">{(revenueByTimeData.find(d => d.period === `${new Date().getMonth() + 1}/${new Date().getFullYear()}`)?.orderCount || 0)}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-start">
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Products Sold</h2>
                    <p className="text-4xl font-bold text-purple-600">{(revenueByTimeData.find(d => d.period === `${new Date().getMonth() + 1}/${new Date().getFullYear()}`)?.productSoldCount || 0)}</p>
                </div>
            </div>

            <div className="charts-section grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Revenue by Time</h2>
                    <div className="flex mb-6 space-x-4 items-center">
                        <label className="inline-flex items-center cursor-pointer">
                            <input
                                type="radio"
                                className="form-radio h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
                                name="period-filter"
                                value="monthly"
                                checked={selectedPeriod === 'monthly'}
                                onChange={handlePeriodChange}
                            />
                            <span className="ml-2 text-gray-700 font-medium">Monthly</span>
                        </label>
                        <label className="inline-flex items-center cursor-pointer">
                            <input
                                type="radio"
                                className="form-radio h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
                                name="period-filter"
                                value="yearly"
                                checked={selectedPeriod === 'yearly'}
                                onChange={handlePeriodChange}
                            />
                            <span className="ml-2 text-gray-700 font-medium">Yearly</span>
                        </label>
                        <label className="inline-flex items-center cursor-pointer">
                            <input
                                type="radio"
                                className="form-radio h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
                                name="period-filter"
                                value="daily"
                                checked={selectedPeriod === 'daily'}
                                onChange={handlePeriodChange}
                            />
                            <span className="ml-2 text-gray-700 font-medium">Daily (Date Range)</span>
                        </label>
                        {selectedPeriod === 'daily' && (
                            <>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={handleStartDateChange}
                                    className="ml-4 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                                />
                                <span className="mx-2 text-gray-600">to</span>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={handleEndDateChange}
                                    className="p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                                />
                            </>
                        )}
                    </div>
                    {revenueByTimeData.length > 0 ? (
                        <Bar data={barChartData} options={barChartOptions} />
                    ) : (
                        <p className="text-gray-500 text-center py-10">No revenue data for the selected period.</p>
                    )}
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Revenue by Category</h2>
                    <div className="flex mb-6 space-x-4 items-center">
                        <div>
                            <label htmlFor="month-select" className="block text-sm font-medium text-gray-700">Month</label>
                            <select
                                id="month-select"
                                value={selectedMonth}
                                onChange={handleMonthChange}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
                            >
                                {months.map(month => (
                                    <option key={month} value={month}>Month {month}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="year-select" className="block text-sm font-medium text-gray-700">Year</label>
                            <select
                                id="year-select"
                                value={selectedYear}
                                onChange={handleYearChange}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
                            >
                                {years.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {revenueByCategoryData.length > 0 ? (
                        <Pie data={pieChartData} options={pieChartOptions} />
                    ) : (
                        <p className="text-gray-500 text-center py-10">No category revenue data for the selected period.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 