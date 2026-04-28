import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const ManageFoundItems = () => {
    const { user } = useAuth();
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchItems = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            // Using the same endpoint from our controller that fetches all found items. 
            // In a real app we might want to fetch without filtering `status: 'stored'` so admin sees everything, 
            // but currently the endpoint filters. Let's create an admin specific endpoint later if needed,
            // or just use the current one.
            const { data } = await axios.get('/api/items/found');
            setItems(data);
        } catch (error) {
            console.error("Failed to load found items", error);
        }
    };

    useEffect(() => {
        if (user) fetchItems();
    }, [user]);

    const filteredItems = items.filter(item => 
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-margin-page max-w-[1200px] mx-auto w-full">
            <div className="mb-stack-lg flex justify-between items-end">
                <div>
                    <h2 className="font-h1 text-on-surface mb-2">Stored Found Items</h2>
                    <p className="font-body-lg text-secondary">Manage physical items currently stored in the admin office.</p>
                </div>
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
                    <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border border-outline-variant rounded-lg bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none font-body-sm w-64" placeholder="Search item or location..." type="text"/>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
                {filteredItems.map(item => (
                    <div key={item._id} className="bg-white border border-outline-variant card-shadow rounded-xl overflow-hidden flex flex-col">
                        <div className="h-40 bg-gray-200 flex items-center justify-center text-gray-500 relative">
                            <span className="material-symbols-outlined text-4xl">inventory_2</span>
                            <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded text-xs font-bold border border-gray-200">{item.status}</div>
                        </div>
                        <div className="p-stack-md flex-grow flex flex-col">
                            <h4 className="font-h3 text-lg text-on-background mb-1">{item.itemName}</h4>
                            <p className="font-body-sm text-secondary mb-4 line-clamp-2">{item.description}</p>
                            <div className="mt-auto grid grid-cols-2 gap-2 text-xs text-gray-600 mb-4">
                                <div className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">location_on</span> {item.location}</div>
                                <div className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">calendar_month</span> {new Date(item.foundAt).toLocaleDateString()}</div>
                            </div>
                        </div>
                    </div>
                ))}
                {filteredItems.length === 0 && <p className="col-span-full py-8 text-center text-gray-500">No stored found items at this time.</p>}
            </div>
        </div>
    );
};

export default ManageFoundItems;
