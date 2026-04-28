import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const BrowseFoundItems = () => {
    const { user } = useAuth();
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('/api/items/found');
                // Filter only unclaimed/stored ones
                setItems(data.filter(item => item.status === 'stored'));
            } catch (error) {
                console.error("Failed to load found items", error);
            }
        };
        if (user) fetchItems();
    }, [user]);

    const filteredItems = items.filter(item => 
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-[1200px] mx-auto p-8 w-full">
            <div className="mb-10">
                <h1 className="font-h1 text-h1 text-on-background mb-2">Browse Found Items</h1>
                <p className="font-body-lg text-secondary">Find and claim your misplaced belongings from across the university campus.</p>
            </div>

            <div className="grid grid-cols-12 gap-8">
                <aside className="col-span-12 lg:col-span-3 space-y-8">
                    <section>
                        <h3 className="font-h3 text-h3 mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">filter_list</span>
                            Search
                        </h3>
                        <div className="space-y-6">
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
                                <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 bg-white border border-outline-variant rounded-lg px-3 py-2 text-body-sm focus:ring-2 focus:ring-primary outline-none" placeholder="Search by name..." type="text"/>
                            </div>
                        </div>
                    </section>
                    <div className="p-6 bg-primary-container rounded-xl text-white relative overflow-hidden shadow-lg">
                        <div className="relative z-10">
                            <h4 className="font-h3 text-h3 mb-2">Lost something?</h4>
                            <p className="text-body-sm opacity-90 mb-4">Report your lost item to help our campus community identify it faster.</p>
                            <Link to="/report-lost" className="bg-white text-primary font-button px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all inline-block">Submit Report</Link>
                        </div>
                        <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-[120px] opacity-10 rotate-12">find_in_page</span>
                    </div>
                </aside>

                <div className="col-span-12 lg:col-span-9">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-body-sm text-secondary">Showing <strong>{filteredItems.length}</strong> items</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredItems.map(item => (
                            <div key={item._id} className="bg-white rounded-xl border border-outline-variant shadow-[0px_4px_12px_rgba(0,0,0,0.05)] overflow-hidden group hover:shadow-[0px_12px_24px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col">
                                <div className="relative h-48 overflow-hidden bg-surface-container flex items-center justify-center text-gray-500">
                                    <span className="material-symbols-outlined text-4xl">inventory_2</span>
                                    <div className="absolute top-3 right-3">
                                        <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Unclaimed</span>
                                    </div>
                                </div>
                                <div className="p-5 flex-grow flex flex-col">
                                    <h3 className="font-h3 text-h3 text-on-surface mb-2">{item.itemName}</h3>
                                    <div className="space-y-2 mb-6">
                                        <div className="flex items-center gap-2 text-outline text-body-sm">
                                            <span className="material-symbols-outlined text-[18px]">location_on</span>
                                            <span>{item.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-outline text-body-sm">
                                            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                                            <span>{new Date(item.foundAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="mt-auto pt-4">
                                        <Link to={`/claim/${item._id}`} className="w-full bg-primary text-white font-button py-3 rounded-lg hover:bg-red-900 transition-colors shadow-sm flex items-center justify-center gap-2">
                                            Claim Item
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {filteredItems.length === 0 && <p className="col-span-full py-8 text-secondary">No items match your search.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrowseFoundItems;
