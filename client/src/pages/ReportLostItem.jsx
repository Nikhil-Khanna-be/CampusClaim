import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ReportLostItem = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        dateLost: '',
        description: '',
        category: 'Electronics',
        mobileNo: ''
    });

    const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('/api/items/lost', formData);
            navigate('/dashboard');
        } catch (err) {
            alert('Error reporting item');
        }
    };

    return (
        <div className="p-margin-page max-w-container-max-width mx-auto w-full">
            <h2 className="font-h1 text-h1 text-on-background mb-stack-md">Report Lost Item</h2>
            <form onSubmit={handleSubmit} className="bg-white p-stack-lg rounded-xl card-shadow space-y-stack-md border border-outline-variant">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
                    <div className="flex flex-col gap-2">
                        <label className="font-label-caps text-secondary">Item Title</label>
                        <input required name="title" value={formData.title} onChange={handleChange} className="p-3 border rounded-lg bg-surface-container-lowest" placeholder="e.g. MacBook Pro" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="font-label-caps text-secondary">Category</label>
                        <select name="category" value={formData.category} onChange={handleChange} className="p-3 border rounded-lg bg-surface-container-lowest">
                            <option value="Electronics">Electronics</option>
                            <option value="Documents">Documents</option>
                            <option value="Accessories">Accessories</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
                    <div className="flex flex-col gap-2">
                        <label className="font-label-caps text-secondary">Location Lost</label>
                        <input required name="location" value={formData.location} onChange={handleChange} className="p-3 border rounded-lg bg-surface-container-lowest" placeholder="e.g. Library 2nd Floor" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="font-label-caps text-secondary">Date Lost</label>
                        <input required type="date" name="dateLost" value={formData.dateLost} onChange={handleChange} className="p-3 border rounded-lg bg-surface-container-lowest" />
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="font-label-caps text-secondary">Description</label>
                    <textarea required name="description" value={formData.description} onChange={handleChange} className="p-3 border rounded-lg bg-surface-container-lowest h-32" placeholder="Provide details like color, brand, specific marks..."></textarea>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="font-label-caps text-secondary">Contact Mobile No</label>
                    <input required name="mobileNo" value={formData.mobileNo} onChange={handleChange} className="p-3 border rounded-lg bg-surface-container-lowest" placeholder="Enter your mobile number" />
                </div>
                <button type="submit" className="w-full bg-primary text-white font-button py-4 rounded-lg shadow-md hover:bg-primary-container">
                    Submit Report
                </button>
            </form>
        </div>
    );
};

export default ReportLostItem;
