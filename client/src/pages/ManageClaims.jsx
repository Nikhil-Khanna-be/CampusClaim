import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const ManageClaims = () => {
    const { user } = useAuth();
    const [claims, setClaims] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchClaims = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('/api/claims');
            setClaims(data);
        } catch (error) {
            console.error("Failed to load claims", error);
        }
    };

    useEffect(() => {
        if (user) fetchClaims();
    }, [user]);

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`/api/claims/${id}`, { status: newStatus });
            fetchClaims(); // Refresh list after update
        } catch (error) {
            alert('Failed to update claim status');
        }
    };

    const pendingCount = claims.filter(c => c.status === 'pending').length;
    const filteredClaims = claims.filter(c => 
        c.userId?.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.itemId?.itemName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-margin-page max-w-[1200px] mx-auto w-full">
            <div className="mb-stack-lg flex justify-between items-end">
                <div>
                    <h2 className="font-h1 text-on-surface mb-2">Claim Requests</h2>
                    <p className="font-body-lg text-secondary">Review and process student claims for lost and found items.</p>
                </div>
                <div className="flex gap-stack-sm">
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
                        <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border border-outline-variant rounded-lg bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none font-body-sm w-64" placeholder="Search by name or item..." type="text"/>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-gutter mb-stack-lg">
                <div className="bg-white p-stack-md rounded-xl border border-outline-variant shadow-sm">
                    <p className="font-label-caps text-secondary uppercase mb-1">Total Pending</p>
                    <p className="font-h1 text-primary">{pendingCount}</p>
                </div>
                <div className="bg-white p-stack-md rounded-xl border border-outline-variant shadow-sm">
                    <p className="font-label-caps text-secondary uppercase mb-1">Total Claims</p>
                    <p className="font-h1 text-on-surface">{claims.length}</p>
                </div>
            </div>

            <div className="space-y-stack-md">
                {filteredClaims.map((claim) => (
                    <div key={claim._id} className={`bg-white rounded-xl border border-outline-variant shadow-sm p-stack-md transition-shadow ${claim.status !== 'pending' ? 'opacity-80 bg-gray-50' : 'hover:shadow-md'}`}>
                        <div className="flex items-start gap-stack-md">
                            <div className="w-32 h-32 rounded-lg bg-surface-container overflow-hidden flex-shrink-0 flex items-center justify-center text-gray-400">
                                <span className="material-symbols-outlined text-4xl">image</span>
                            </div>
                            
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <span className={`inline-block px-2 py-1 rounded-full font-label-caps text-[10px] uppercase mb-2 ${
                                            claim.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            claim.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {claim.status}
                                        </span>
                                        <h3 className="font-h2 text-lg text-on-surface">{claim.itemId?.itemName}</h3>
                                        {claim.answers && <p className="text-sm text-gray-600 mt-1">Proof Provided: {claim.answers}</p>}
                                    </div>
                                    <span className="font-body-sm text-secondary">{new Date(claim.createdAt).toLocaleString()}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-outline text-lg">person</span>
                                        <div>
                                            <p className="font-label-caps text-[10px] text-secondary">STUDENT NAME</p>
                                            <p className="font-body-sm font-semibold">{claim.userId?.username}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-outline text-lg">badge</span>
                                        <div>
                                            <p className="font-label-caps text-[10px] text-secondary">STUDENT ID</p>
                                            <p className="font-body-sm font-semibold">{claim.userId?.rollNo}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                {claim.status === 'pending' ? (
                                    <div className="flex justify-end items-center gap-3 border-t border-gray-100 pt-4">
                                        <button onClick={() => handleUpdateStatus(claim._id, 'rejected')} className="px-4 py-2 font-button text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-red-200">
                                            Reject Claim
                                        </button>
                                        <button onClick={() => handleUpdateStatus(claim._id, 'approved')} className="px-6 py-2 bg-[#2e7d32] text-white font-button rounded-lg hover:bg-[#1b5e20] shadow-sm active:scale-95 transition-all">
                                            Approve & Release
                                        </button>
                                    </div>
                                ) : (
                                    <div className={`flex justify-end pt-4 border-t border-gray-100 font-body-sm italic ${claim.status === 'approved' ? 'text-[#2e7d32]' : 'text-red-600'}`}>
                                        Claim {claim.status} by Admin
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                {filteredClaims.length === 0 && <p className="text-center text-gray-500 py-8">No claims requested yet or no claims match your search.</p>}
            </div>
        </div>
    );
};

export default ManageClaims;
