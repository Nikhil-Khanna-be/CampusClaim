import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const ManageLostItems = () => {
    const { user } = useAuth();
    const [items, setItems] = useState([]);
    
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('/api/items/admin/lost/all');
                setItems(data);
            } catch (error) {
                console.error("Failed to load lost items", error);
            }
        };
        if (user) fetchItems();
    }, [user]);

    return (
        <div className="p-margin-page max-w-[1200px] mx-auto w-full">
            <div className="mb-stack-lg">
                <h2 className="font-h1 text-on-surface mb-2">Student Lost Reports</h2>
                <p className="font-body-lg text-secondary">View all items reported as lost by students to help cross-reference with newly found items.</p>
            </div>

            <div className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden text-sm">
                <table className="w-full text-left">
                    <thead className="bg-surface-container-low border-b border-outline-variant font-label-caps text-secondary text-xs uppercase">
                        <tr>
                            <th className="px-6 py-4">Item Details</th>
                            <th className="px-6 py-4">Location & Date Lost</th>
                            <th className="px-6 py-4">Student Info</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {items.map(item => (
                            <tr key={item._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <p className="font-bold text-on-surface">{item.title}</p>
                                    <p className="text-secondary text-xs truncate max-w-[200px]">{item.description}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-on-surface">{item.location}</p>
                                    <p className="text-secondary text-xs">{new Date(item.dateLost).toLocaleDateString()}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-on-surface">{item.userId?.username}</p>
                                    <p className="text-secondary text-xs">{item.mobileNo}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {item.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {items.length === 0 && <p className="text-center text-gray-500 py-8">No active lost reports.</p>}
            </div>
        </div>
    );
};

export default ManageLostItems;
