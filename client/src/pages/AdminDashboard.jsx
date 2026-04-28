import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalLost: 0,
        foundStored: 0,
        pendingClaims: 0
    });
    const [recentClaims, setRecentClaims] = useState([]);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                // Fetch stats logic
                const { data: claims } = await axios.get('/api/claims');
                const pending = claims.filter(c => c.status === 'pending').length;
                
                const { data: lost } = await axios.get('/api/items/lost/all');
                const { data: found } = await axios.get('/api/items/found'); // found status is stored filter inside controller
                
                setStats({
                    totalLost: lost.length,
                    foundStored: found.length,
                    pendingClaims: pending
                });
                
                setRecentClaims(claims.slice(0, 5));
            } catch (error) {
                console.error("Failed to load admin data", error);
            }
        };
        fetchAdminData();
    }, [user]);

    return (
        <div className="max-w-[1200px] w-full mx-auto p-margin-page space-y-stack-lg">
            {/* Welcome Header */}
            <section className="bg-white rounded-xl p-8 border border-gray-200 shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex justify-between items-center overflow-hidden relative">
                <div className="relative z-10">
                    <h2 className="font-h1 text-h1 text-on-background">System Overview</h2>
                    <p className="font-body-lg text-body-lg text-secondary mt-2">Welcome back, {user?.username}. Here's what's happening at the Campus Claim office today.</p>
                </div>
                <div className="hidden md:block absolute right-0 top-0 h-full w-1/3 opacity-10 pointer-events-none">
                    <div className="w-full h-full bg-gradient-to-l from-primary to-transparent"></div>
                </div>
                <span className="material-symbols-outlined text-[120px] text-primary/5 absolute -right-4 -bottom-4">admin_panel_settings</span>
            </section>

            {/* Stats Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-red-50 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                            <span className="material-symbols-outlined">person_search</span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="font-label-caps text-label-caps text-secondary uppercase">Total Lost Items</p>
                        <p className="text-4xl font-bold text-on-background">{stats.totalLost}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-red-50 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                            <span className="material-symbols-outlined">inventory_2</span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="font-label-caps text-label-caps text-secondary uppercase">Found Items Stored</p>
                        <p className="text-4xl font-bold text-on-background">{stats.foundStored}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-red-50 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                            <span className="material-symbols-outlined">pending_actions</span>
                        </div>
                        {stats.pendingClaims > 0 && <span className="text-red-600 font-bold text-xs bg-red-50 px-2 py-1 rounded-full">Requires Attention</span>}
                    </div>
                    <div className="space-y-1">
                        <p className="font-label-caps text-label-caps text-secondary uppercase">Pending Claims</p>
                        <p className="text-4xl font-bold text-on-background">{stats.pendingClaims}</p>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-[0_4px_12px_rgba(0,0,0,0.05)] overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-h3 text-h3 text-on-background flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">history</span>
                            Recent Claims
                        </h3>
                        <Link to="/admin/manage-claims" className="text-primary font-button text-button hover:underline">View All</Link>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {recentClaims.length === 0 ? (
                            <p className="p-4 text-secondary">No recent claims.</p>
                        ) : (
                            recentClaims.map(claim => (
                                <div key={claim._id} className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                                        <span className="material-symbols-outlined">info</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-body-sm text-on-background">Claim submitted for <strong>{claim.itemId?.itemName}</strong></p>
                                        <p className="text-xs text-gray-500">{new Date(claim.createdAt).toLocaleDateString()} • Submitted by {claim.userId?.username}</p>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${claim.status === 'pending' ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>{claim.status}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="space-y-gutter">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-[0_4px_12px_rgba(0,0,0,0.05)] p-6">
                        <h3 className="font-h3 text-h3 text-on-background mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <Link to="/admin/add-found" className="flex flex-col items-center justify-center p-4 bg-red-50 hover:bg-red-100 rounded-xl transition-colors text-primary gap-2">
                                <span className="material-symbols-outlined text-2xl">add_box</span>
                                <span className="text-[10px] font-bold uppercase tracking-wider">Add Found Item</span>
                            </Link>
                            <Link to="/admin/manage-claims" className="flex flex-col items-center justify-center p-4 bg-red-50 hover:bg-red-100 rounded-xl transition-colors text-primary gap-2">
                                <span className="material-symbols-outlined text-2xl">checklist</span>
                                <span className="text-[10px] font-bold uppercase tracking-wider">Claims</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            
            <Link to="/admin/add-found" className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform flex items-center justify-center z-50">
                <span className="material-symbols-outlined text-3xl">add</span>
            </Link>
        </div>
    );
};

export default AdminDashboard;
