import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const ClaimItem = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [answers, setAnswers] = useState('');

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('/api/items/found');
                const target = data.find(i => i._id === id);
                setItem(target);
            } catch (err) {
                console.error(err);
            }
        };
        fetchItem();
    }, [id, user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('/api/claims', { itemId: id, answers });
            navigate('/my-claims');
        } catch (err) {
            alert('Failed to submit claim. You may have already submitted one.');
        }
    };

    if (!item) return <div className="p-8">Loading...</div>;

    return (
        <div className="max-w-[800px] mx-auto p-margin-page w-full">
            <h2 className="font-h1 text-h1 text-on-background mb-stack-lg">Submit a Claim</h2>
            
            <div className="bg-white p-stack-lg rounded-xl border border-outline-variant shadow-sm mb-stack-lg flex gap-4">
                <div className="w-24 h-24 bg-surface-container rounded-lg flex items-center justify-center text-gray-500">
                    <span className="material-symbols-outlined text-4xl">inventory_2</span>
                </div>
                <div>
                    <h3 className="font-h2 text-primary">{item.itemName}</h3>
                    <p className="text-secondary">{item.description}</p>
                    <p className="text-sm mt-2 font-bold">Found near: {item.location}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-stack-lg rounded-xl border border-outline-variant shadow-sm space-y-stack-md">
                <div className="space-y-4">
                    <label className="font-h3 text-on-surface block">Verification Proof</label>
                    <p className="text-body-sm text-secondary">To ensure this item belongs to you, please provide specific details only the owner would know (e.g. wallpaper picture, specific scratches, contents inside, password pins if electronics).</p>
                    <textarea required value={answers} onChange={e => setAnswers(e.target.value)} className="w-full border border-outline-variant rounded-lg p-4 font-body-sm h-32 focus:ring-2 focus:ring-primary outline-none" placeholder="My wallpaper has a picture of a golden retriever. The case has a crack on the bottom left corner..."></textarea>
                </div>
                
                <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                    <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 border border-outline text-secondary rounded hover:bg-gray-50">Cancel</button>
                    <button type="submit" className="px-8 py-2 bg-primary text-white rounded font-button hover:bg-primary-container shadow-sm">Submit Claim</button>
                </div>
            </form>
        </div>
    );
};

export default ClaimItem;
