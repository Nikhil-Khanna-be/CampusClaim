import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddFoundItem = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        itemName: '',
        category: 'Electronics',
        description: '',
        location: '',
        foundAt: '',
        founderId: ''
    });

    const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            // Optional: You can attach the founder logic if the admin types a student ID
            await axios.post('/api/items/admin/found', formData);
            navigate('/admin');
        } catch (err) {
            alert('Error adding found item');
        }
    };

    return (
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-8 w-full">
            <div className="mb-8">
                <h2 className="font-h2 text-h2 text-primary mb-2">Add Found Item</h2>
                <p className="font-body-lg text-body-lg text-secondary">Register a new item recovered on campus to begin the claim process.</p>
            </div>

            <div className="bg-white border border-outline-variant rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] overflow-hidden">
                <div className="p-6 sm:p-8">
                    <form className="space-y-8" onSubmit={handleSubmit}>
                        {/* Section 1: Basic Information */}
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg">
                            <div className="col-span-full border-b border-surface-variant pb-2">
                                <h3 className="font-h3 text-h3 text-on-surface">General Details</h3>
                            </div>
                            <div className="space-y-2">
                                <label className="font-label-caps text-label-caps text-secondary block">ITEM NAME</label>
                                <input required name="itemName" value={formData.itemName} onChange={handleChange} className="w-full px-4 py-3 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-body-sm" placeholder="e.g. Silver MacBook Air" type="text"/>
                            </div>
                            <div className="space-y-2">
                                <label className="font-label-caps text-label-caps text-secondary block">CATEGORY</label>
                                <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-3 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-body-sm bg-white">
                                    <option value="Electronics">Electronics</option>
                                    <option value="Books">Books & Stationary</option>
                                    <option value="Clothing">Clothing & Accessories</option>
                                    <option value="Keys">Keys & ID Cards</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="col-span-full space-y-2">
                                <label className="font-label-caps text-label-caps text-secondary block">DETAILED DESCRIPTION</label>
                                <textarea required name="description" value={formData.description} onChange={handleChange} className="w-full px-4 py-3 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-body-sm" placeholder="Mention distinctive marks, color, brand, or any unique features..." rows="4"></textarea>
                            </div>
                        </section>

                        {/* Section 2: Discovery Details */}
                        <section className="grid grid-cols-1 md:grid-cols-3 gap-stack-lg">
                            <div className="col-span-full border-b border-surface-variant pb-2">
                                <h3 className="font-h3 text-h3 text-on-surface">Discovery Details</h3>
                            </div>
                            <div className="space-y-2">
                                <label className="font-label-caps text-label-caps text-secondary block">LOCATION FOUND</label>
                                <input required name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-3 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-body-sm" placeholder="e.g. Main Library" />
                            </div>
                            <div className="space-y-2">
                                <label className="font-label-caps text-label-caps text-secondary block">DATE & TIME FOUND</label>
                                <input required name="foundAt" value={formData.foundAt} onChange={handleChange} className="w-full px-4 py-3 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-body-sm" type="datetime-local"/>
                            </div>
                            <div className="space-y-2">
                                <label className="font-label-caps text-label-caps text-secondary block">FOUNDER ID (Optional)</label>
                                <input name="founderId" value={formData.founderId} onChange={handleChange} className="w-full px-4 py-3 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-body-sm" placeholder="Student ID if given" />
                            </div>
                        </section>

                        {/* CTA Actions */}
                        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-6 border-t border-surface-variant">
                            <button type="button" onClick={() => navigate(-1)} className="w-full sm:w-auto px-8 py-3 font-button text-button text-primary border border-primary rounded-lg hover:bg-primary-fixed transition-colors active:scale-95">
                                Cancel
                            </button>
                            <button type="submit" className="w-full sm:w-auto px-10 py-3 font-button text-button bg-primary text-white rounded-lg shadow-md hover:bg-primary-container transition-all active:scale-95 flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-sm">publish</span>
                                Post Found Item
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="mt-8 p-4 bg-secondary-container rounded-lg flex items-start gap-4">
                <span className="material-symbols-outlined text-on-secondary-container">info</span>
                <div>
                    <h4 className="font-label-caps text-label-caps text-on-secondary-container mb-1">ADMIN PROTOCOL</h4>
                    <p className="font-body-sm text-body-sm text-on-secondary-container opacity-90">All items submitted through this portal will be immediately visible to students. Please ensure descriptions are accurate but do not include sensitive personal identification info found inside the item.</p>
                </div>
            </div>
        </div>
    );
};

export default AddFoundItem;
