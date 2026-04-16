import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api';

const Dashboard = () => {
    const [points, setPoints] = useState(0);
    const [history, setHistory] = useState([]);
    const [originalHistory, setOriginalHistory] = useState([]);
    const [sortBy, setSortBy] = useState('');
    const [filterBy, setFilterBy] = useState('');
    
    // ✅ PAGINATION STATE
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    
    const navigate = useNavigate();

    const user = (() => {
        try {
            return JSON.parse(localStorage.getItem('user'));
        } catch {
            return null;
        }
    })();

    useEffect(() => {
        if (!user || !user.id) {
            navigate('/login');
            return;
        }

        fetchPoints();
    }, []);

    const fetchPoints = async () => {
        try {
            const response = await api.get(`/get_points.php?user_id=${user.id}`);

            const data = Array.isArray(response.data?.history)
                ? response.data.history
                : [];

            setPoints(response.data?.total_points ?? 0);
            setHistory(data);
            setOriginalHistory(data);

        } catch (err) {
            console.error('Failed to fetch points', err);

            if (user.id === 999) {
                const demoData = [
                    {
                        id: 1,
                        description: 'purchase',
                        points: 30,
                        cost: 1500,
                        created_at: new Date().toISOString()
                    },
                    {
                        id: 2,
                        description: 'service',
                        points: 100,
                        cost: 5000,
                        created_at: new Date().toISOString()
                    },
                    {
                        id: 3,
                        description: 'bonus',
                        points: 200,
                        cost: 0,
                        created_at: new Date().toISOString()
                    }
                ];

                setPoints(330);
                setHistory(demoData);
                setOriginalHistory(demoData);
            }
        }
    };

    const handleSort = (type) => {
        setSortBy(type);
        setCurrentPage(1); 
        
        let sorted = [...history];

        if (type === 'date') {
            sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } else if (type === 'points') {
            sorted.sort((a, b) => b.points - a.points);
        } else if (type === 'cost') {
            sorted.sort((a, b) => b.cost - a.cost);
        }

        setHistory(sorted);
    };

    const handleFilter = (type) => {
        setFilterBy(type);
        setCurrentPage(1); // ✅ Reset to page 1 when filtering
        
        if (!type) {
            setHistory(originalHistory);
            return;
        }

        const filtered = originalHistory.filter(
            item => item.description === type
        );

        setHistory(filtered);
    };

    const resetData = () => {
        setHistory(originalHistory);
        setSortBy('');
        setFilterBy('');
        setCurrentPage(1); 
    };

    // ✅ PAGINATION LOGIC
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = history.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(history.length / itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="container">

                <div className="loyalty-slab">
                    <h2 className="text-xl font-bold mb-2">Loyalty Slab</h2>
                    <p className="text-gray-600">
                        Earn <span className="text-red-500 font-bold">2%</span> of your spend as Loyalty Points.
                    </p>
                </div>

                <div className="card">
                    <h1 className="text-3xl font-bold text-gray-800">
                        NextGen Tyres Loyalty Dashboard
                    </h1>

                    <div className="dashboard-header">
                        <p>Total Loyalty Points</p>
                        <p>{points}</p>
                    </div>
                </div>

                <div className="card">

                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">Transactions</h3>

                        <div className="flex gap-2">
                            {/* SORT */}
                            <select
                                value={sortBy}
                                className="px-3 py-1 border rounded"
                                onChange={(e) => handleSort(e.target.value)}
                            >
                                <option value="">Sort</option>
                                <option value="date">By Date</option>
                                <option value="points">By Points</option>
                                <option value="cost">By Cost Spent</option>
                            </select>

                            {/* FILTER */}
                            <select
                                value={filterBy}
                                className="px-3 py-1 border rounded"
                                onChange={(e) => handleFilter(e.target.value)}
                            >
                                <option value="">Filter</option>
                                <option value="purchase">Purchase</option>
                                <option value="service">Service</option>
                            </select>

                            {/* RESET */}
                            <button
                                className="px-3 py-1 bg-gray-200 rounded"
                                onClick={resetData}
                            >
                                Reset
                            </button>
                        </div>
                    </div>

                    {/* TABLE */}
                    {currentItems.length > 0 ? (
                        <>
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Description</th>
                                            <th>Date</th>
                                            <th>Cost Spent</th>
                                            <th className="text-right">Points Earned</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentItems.map(item => (
                                            <tr key={item.id}>
                                                <td className="font-bold">{item.description}</td>
                                                <td className="text-gray-500">
                                                    {item.created_at
                                                        ? new Date(item.created_at).toLocaleDateString()
                                                        : '-'}
                                                </td>
                                                <td className="font-bold">₹{item.cost ?? 0}</td>
                                                <td className="text-right text-green-600 font-bold">
                                                    +{item.points}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* ✅ PAGINATION CONTROLS */}
                            {totalPages > 1 && (
                                <div className="px-2 py-1 mt-4 border-t pagination">
                                    <div className="flex gap-2 pagination-controls">
                                        <button
                                            onClick={handlePrevPage}
                                            disabled={currentPage === 1}
                                            className= {`px-1 py-1 rounded text-sm ${
                                                currentPage === 1
                                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                    : 'bg-blue-500 text-black hover:bg-blue-600'
                                            }`}
                                        >
                                            Previous
                                        </button>
                                        
                                        <span className="px-2 py-1 text-gray-700">
                                            Page {currentPage} of {totalPages}
                                        </span>
                                        
                                        <button
                                            onClick={handleNextPage}
                                            disabled={currentPage === totalPages}
                                            className={`px-1 py-1 rounded text-sm ${
                                                currentPage === totalPages
                                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                    : 'bg-blue-500 text-black hover:bg-blue-600'
                                            }`}  
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <p className="text-gray-500">No history yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;