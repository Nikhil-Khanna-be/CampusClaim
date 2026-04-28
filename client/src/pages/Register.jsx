import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({ fullName: '', rollNo: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }
        try {
            await register(formData.fullName, formData.rollNo, formData.password, 'student');
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register');
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-surface-bright text-on-background">
            <header className="flex justify-between items-center w-full px-6 py-4 sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-2xl">school</span>
                    <span className="text-primary font-h1 text-h3 tracking-tight">Campus Claim</span>
                </div>
                <div className="hidden md:flex items-center gap-4">
                    <span className="text-secondary font-body-sm">Already have an account?</span>
                    <Link to="/login" className="text-primary font-button hover:underline underline-offset-4">Login</Link>
                </div>
            </header>
            
            <main className="flex-grow flex items-center justify-center px-4 py-12 md:py-20">
                <div className="w-full max-w-container-max-width flex flex-col md:flex-row bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-gray-200 overflow-hidden min-h-[600px]">
                    <div className="hidden md:flex flex-1 relative bg-primary-container p-12 flex-col justify-end">
                        <div className="absolute inset-0 opacity-20 overflow-hidden">
                            <img alt="University Campus Architecture" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCs68ij2t3TpUsLOABlfpMJp4Tf6NCylCeMWKZwlspbWC1TYzVDjz1q6frAK5MabgCH5VDDr81UwiaUroRaDguY5EsMF5Cc-h1zDGBBi9cjyNBRl4MCFPAXxUcDjPZ-FQH0k98WgVYR535jnKDnptp__7vKtJ7p0CAHJGS2Zd1SBEesJNzP40HF-xgBpg8_7LslJip5DOzJL-IAj8aLUHHXoL_mXpVeL4KdFuccmnK_YZ8yFogI8ZBPoh3QuAc2PMnqUT20fpvg8P8"/>
                            <div className="absolute inset-0 bg-gradient-to-t from-primary to-transparent"></div>
                        </div>
                        <div className="relative z-10 text-white">
                            <h1 className="font-h1 text-h1 mb-4">Reuniting students with their lost essentials.</h1>
                            <p className="font-body-lg text-white/80 max-w-md">Join the official University Lost and Found network to report items, track claims, and help your peers.</p>
                            <div className="mt-8 flex items-center gap-4">
                                <span className="font-body-sm text-white/90">Over 5,000+ students joined</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                        <div className="mb-8">
                            <h2 className="font-h2 text-h2 text-on-surface mb-2">Create Student Account</h2>
                            <p className="font-body-sm text-secondary">Please use your official university credentials to register.</p>
                        </div>
                        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded my-2">{error}</div>}
                        <form className="space-y-stack-md" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
                                <div className="flex flex-col gap-2">
                                    <label className="font-label-caps text-label-caps text-secondary">FULL NAME</label>
                                    <input required name="fullName" value={formData.fullName} onChange={handleChange} className="px-4 py-3 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-body-sm bg-surface-container-lowest" placeholder="Alex Johnson" type="text"/>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-label-caps text-label-caps text-secondary">STUDENT ID (Roll No)</label>
                                    <input required name="rollNo" value={formData.rollNo} onChange={handleChange} className="px-4 py-3 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-body-sm bg-surface-container-lowest" placeholder="U2024-XXXXX" type="text"/>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="font-label-caps text-label-caps text-secondary">UNIVERSITY EMAIL</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-lg">mail</span>
                                    <input required name="email" value={formData.email} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-body-sm bg-surface-container-lowest" placeholder="alex.j@university.edu" type="email"/>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
                                <div className="flex flex-col gap-2">
                                    <label className="font-label-caps text-label-caps text-secondary">PASSWORD</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-lg">lock</span>
                                        <input required name="password" value={formData.password} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-body-sm bg-surface-container-lowest" placeholder="••••••••" type="password"/>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-label-caps text-label-caps text-secondary">CONFIRM PASSWORD</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-lg">lock_reset</span>
                                        <input required name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-body-sm bg-surface-container-lowest" placeholder="••••••••" type="password"/>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4 space-y-4">
                                <button type="submit" className="w-full bg-primary text-white font-button py-4 rounded-lg shadow-md hover:bg-primary-container active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                                    Register
                                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                </button>
                                <div className="flex items-center justify-center gap-2 md:hidden">
                                    <span className="text-secondary font-body-sm">Already have an account?</span>
                                    <Link to="/login" className="text-primary font-button hover:underline">Login</Link>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Register;
