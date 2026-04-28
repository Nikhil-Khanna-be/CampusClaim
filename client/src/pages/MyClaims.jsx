import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';

const MyClaims = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('claims'); // 'claims' or 'reports'
    const [claims, setClaims] = useState([]);
    const [reports, setReports] = useState([]);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const [{ data: claimsData }, { data: reportsData }] = await Promise.all([
                    axios.get('/api/claims/my'),
                    axios.get('/api/items/lost/my')
                ]);
                setClaims(claimsData);
                setReports(reportsData);
            } catch (error) {
                console.error("Failed to load user data", error);
            }
        };
        if (user) fetchData();
    }, [user]);

    return (
        <div className="max-w-[1000px] mx-auto p-margin-page w-full">
            {/* User Context Header */}
            <header className="mb-10 bg-white border border-outline-variant p-6 rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full border-4 border-surface-container overflow-hidden bg-primary-container flex items-center justify-center text-white text-3xl font-bold">
                        {user?.username ? user.username.charAt(0).toUpperCase() : 'S'}
                    </div>
                    <div>
                        <h1 className="font-h1 text-h1 text-on-surface">{user?.username}</h1>
                        <p className="font-body-sm text-body-sm text-outline">Student ID: {user?.rollNo} • Standard Access</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="text-right">
                        <p className="font-label-caps text-label-caps text-outline mb-1 uppercase">Active Claims</p>
                        <p className="font-h2 text-h2 text-primary">{claims.length}</p>
                    </div>
                    <div className="w-px h-12 bg-outline-variant mx-2 hidden md:block"></div>
                    <div className="text-right">
                        <p className="font-label-caps text-label-caps text-outline mb-1 uppercase">Lost Reports</p>
                        <p className="font-h2 text-h2 text-on-surface">{reports.length}</p>
                    </div>
                </div>
            </header>

            <section className="space-y-6">
                {/* Tab Navigation */}
                <div className="flex border-b border-outline-variant gap-8 overflow-x-auto">
                    <button onClick={() => setActiveTab('claims')} className={`pb-4 px-2 border-b-4 font-button text-body-lg whitespace-nowrap transition-colors ${activeTab === 'claims' ? 'border-primary text-primary' : 'border-transparent text-outline hover:text-on-surface'}`}>
                        My Claims
                    </button>
                    <button onClick={() => setActiveTab('reports')} className={`pb-4 px-2 border-b-4 font-button text-body-lg whitespace-nowrap transition-colors ${activeTab === 'reports' ? 'border-primary text-primary' : 'border-transparent text-outline hover:text-on-surface'}`}>
                        My Lost Reports
                    </button>
                </div>

                {activeTab === 'claims' && (
                    <div className="space-y-stack-md">
                        {claims.map(claim => (
                            <div key={claim._id} className="bg-white p-stack-md rounded-xl border border-outline-variant shadow-sm flex flex-col md:flex-row items-start md:items-center gap-6">
                                <div className="w-24 h-24 bg-surface-container rounded-lg flex items-center justify-center flex-shrink-0 text-gray-500">
                                    <span className="material-symbols-outlined text-4xl">inventory_2</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-col mb-2">
                                        <span className={`self-start inline-block px-2 py-1 rounded-full font-label-caps text-[10px] uppercase mb-2 ${
                                            claim.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            claim.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            Status: {claim.status}
                                        </span>
                                        <h3 className="font-h2 text-xl">{claim.itemId?.itemName || 'Deleted Item'}</h3>
                                    </div>
                                    <div className="text-secondary text-sm space-y-1">
                                        <p><strong>Submitted:</strong> {new Date(claim.createdAt).toLocaleDateString()}</p>
                                        <p><strong>Your Proof:</strong> {claim.answers}</p>
                                    </div>
                                </div>
                                {claim.status === 'approved' && (
                                    <div className="bg-green-50 text-green-800 p-4 rounded-lg flex items-start gap-2 border border-green-200 w-full md:w-auto">
                                        <span className="material-symbols-outlined">check_circle</span>
                                        <div>
                                            <p className="font-bold text-sm">Action Required</p>
                                            <p className="text-xs max-w-[200px]">Visit the Admin office with your Student ID to collect it.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        {claims.length === 0 && (
                            <div className="text-center py-12 bg-white rounded-xl border border-outline-variant border-dashed">
                                <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">task</span>
                                <p className="text-secondary font-h3 mb-2">You haven't made any claims yet.</p>
                                <Link to="/browse-found" className="text-primary hover:underline font-button">Browse Found Items</Link>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'reports' && (
                    <div className="space-y-stack-md">
                        {reports.map(report => (
                            <div key={report._id} className="bg-white p-stack-md rounded-xl border border-outline-variant shadow-sm flex flex-col md:flex-row items-start md:items-center gap-6">
                                <div className="w-24 h-24 bg-surface-container rounded-lg flex items-center justify-center flex-shrink-0 text-gray-500">
                                    <span className="material-symbols-outlined text-4xl">search_check</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-h2 text-xl mb-1">{report.title}</h3>
                                    <p className="text-body-sm text-secondary line-clamp-2 mb-2">{report.description}</p>
                                    <div className="text-xs text-outline flex items-center gap-4">
                                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">location_on</span> {report.location}</span>
                                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">calendar_today</span> {new Date(report.dateLost).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="bg-gray-50 text-gray-600 p-4 rounded-lg border border-gray-200">
                                    <p className="font-bold text-sm uppercase">Active Report</p>
                                    <p className="text-xs max-w-[150px]">Admins use this to cross-reference newly found campus items.</p>
                                </div>
                            </div>
                        ))}
                        {reports.length === 0 && (
                            <div className="text-center py-12 bg-white rounded-xl border border-outline-variant border-dashed">
                                <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">note_add</span>
                                <p className="text-secondary font-h3 mb-2">You have no active lost reports.</p>
                                <Link to="/report-lost" className="text-primary hover:underline font-button">Report a Lost Item</Link>
                            </div>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
};

export default MyClaims;
