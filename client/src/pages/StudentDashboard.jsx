import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [lostItems, setLostItems] = useState([]);
    const [foundItemsCount, setFoundItemsCount] = useState(0);
    const [recentDiscoveries, setRecentDiscoveries] = useState([]);
    const [myClaims, setMyClaims] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                // Fetch My Lost Items
                const { data: lostData } = await axios.get('/api/items/lost/my');
                setLostItems(lostData);

                // Fetch All Found Items to get count and recent
                const { data: foundData } = await axios.get('/api/items/found');
                setFoundItemsCount(foundData.length);
                setRecentDiscoveries(foundData.slice(0, 4)); // top 4

                // Fetch My Claims
                const { data: claimsData } = await axios.get('/api/claims/my');
                setMyClaims(claimsData);
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            }
        };
        if (user) fetchDashboardData();
    }, [user]);

    return (
        <div className="p-margin-page max-w-container-max-width mx-auto w-full">
            {/* User Context Header */}
            <div className="bg-white border border-outline-variant card-shadow rounded-xl p-stack-lg mb-stack-lg flex flex-col md:flex-row md:items-center justify-between gap-stack-md">
                <div className="flex items-center gap-stack-md">
                    <div className="w-16 h-16 rounded-full border-2 border-primary-container p-1 shadow-sm flex items-center justify-center bg-surface-variant text-primary text-xl font-bold">
                        {user?.username ? user.username.charAt(0).toUpperCase() : 'S'}
                    </div>
                    <div>
                        <h1 className="font-h1 text-h1 text-on-background">Welcome back, {user?.username}</h1>
                        <p className="font-body-sm text-secondary">Student ID: {user?.rollNo} • Standard Access</p>
                    </div>
                </div>
                <Link to="/report-lost" className="bg-primary hover:bg-red-900 text-on-primary font-button px-stack-lg py-4 rounded-lg flex items-center gap-2 transition-all shadow-md active:scale-95 text-white">
                    <span className="material-symbols-outlined">add_circle</span>
                    Report Lost Item
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-stack-lg">
                <div className="md:col-span-4 bg-white border border-outline-variant card-shadow rounded-xl p-stack-lg flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="material-symbols-outlined text-primary text-3xl">search_check</span>
                        <span className="text-label-caps font-label-caps text-secondary uppercase">Your Lost Reports</span>
                    </div>
                    <div className="mt-4">
                        <div className="text-[48px] font-extrabold text-primary leading-none">{lostItems.length < 10 ? `0${lostItems.length}` : lostItems.length}</div>
                        <p className="text-body-sm text-secondary mt-2">Active investigations</p>
                    </div>
                </div>
                <div className="md:col-span-4 bg-white border border-outline-variant card-shadow rounded-xl p-stack-lg flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="material-symbols-outlined text-tertiary-container text-3xl">inventory_2</span>
                        <span className="text-label-caps font-label-caps text-secondary uppercase">Items Found</span>
                    </div>
                    <div className="mt-4">
                        <div className="text-[48px] font-extrabold text-tertiary-container leading-none">{foundItemsCount < 10 ? `0${foundItemsCount}` : foundItemsCount}</div>
                        <p className="text-body-sm text-secondary mt-2">Currently pending claims</p>
                    </div>
                </div>
                <div className="md:col-span-4 bg-surface-container border border-outline-variant card-shadow rounded-xl p-stack-lg">
                    <h3 className="font-h3 text-h3 text-primary mb-stack-sm">Campus Notice</h3>
                    <p className="text-body-sm text-on-surface-variant">Central Library lost property collection is moving to Building C starting Monday. Please visit the new counter for items lost in the North Quad.</p>
                </div>
            </div>

            {/* Recent Discoveries */}
            <section className="mb-stack-lg">
                <div className="flex items-center justify-between mb-stack-md">
                    <h2 className="font-h2 text-h2 text-on-background">Recent Discoveries</h2>
                    <Link to="/browse-found" className="text-primary font-button flex items-center gap-1 hover:underline">
                        View All Catalog <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
                    {recentDiscoveries.length === 0 ? (
                        <p className="col-span-full text-secondary">No items found recently.</p>
                    ) : (
                        recentDiscoveries.map(item => (
                            <div key={item._id} className="bg-white border border-outline-variant card-shadow rounded-xl overflow-hidden group flex flex-col">
                                <div className="h-48 bg-gray-200 overflow-hidden relative flex items-center justify-center text-gray-500">
                                    <span className="material-symbols-outlined text-5xl">image</span>
                                    <div className="absolute top-3 left-3">
                                        <span className="bg-tertiary text-on-tertiary text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider">{item.status}</span>
                                    </div>
                                </div>
                                <div className="p-stack-md flex-grow flex flex-col">
                                    <h4 className="font-h3 text-[18px] text-on-background mb-1">{item.itemName}</h4>
                                    <p className="text-body-sm text-secondary mb-4 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">location_on</span>
                                        {item.location}
                                    </p>
                                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                        <span className="text-label-caps text-gray-500">{new Date(item.foundAt).toLocaleDateString()}</span>
                                        <Link to={`/claim/${item._id}`} className="text-primary font-button border border-primary px-3 py-1.5 rounded hover:bg-red-50 transition-colors">Claim</Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
};

export default StudentDashboard;
