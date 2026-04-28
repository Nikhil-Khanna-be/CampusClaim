import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [rollNo, setRollNo] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const userData = await login(rollNo, password);
            if (userData.role === 'admin' || userData.role === 'adminHead') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to login');
        }
    };

    return (
        <div className="bg-background text-on-background min-h-screen flex flex-col">
            <header className="flex justify-between items-center w-full px-6 py-3 sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-red-800">school</span>
                    <span className="font-['Public_Sans'] font-semibold tracking-tight text-red-800 text-xl uppercase tracking-wider">Campus Claim</span>
                </div>
            </header>

            <main className="flex-grow flex items-center justify-center px-margin-page py-12 bg-surface-container-low relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
                </div>

                <div className="w-full max-w-[440px] z-10">
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] overflow-hidden">
                        <div className="p-stack-lg border-b border-outline-variant bg-white">
                            <div className="flex flex-col items-center text-center space-y-stack-sm">
                                <div className="w-16 h-16 bg-primary-container rounded-xl flex items-center justify-center mb-2">
                                    <span className="material-symbols-outlined text-white text-3xl">school</span>
                                </div>
                                <h1 className="font-h1 text-h1 text-primary">Chitkara University Login</h1>
                                <p className="font-body-sm text-body-sm text-secondary">Sign in to manage your lost and found items</p>
                            </div>
                        </div>

                        <div className="p-stack-lg space-y-stack-md">
                            {error && <div className="p-3 bg-red-100 text-red-700 rounded mb-2">{error}</div>}
                            <form className="space-y-stack-md" onSubmit={handleSubmit}>
                                <div className="space-y-2">
                                    <label className="font-label-caps text-label-caps text-on-surface-variant block">Student/Staff ID</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">badge</span>
                                        <input required value={rollNo} onChange={(e) => setRollNo(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white border border-outline-variant rounded-lg font-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="Enter your University ID" type="text"/>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="font-label-caps text-label-caps text-on-surface-variant block">Password</label>
                                    </div>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">lock</span>
                                        <input required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white border border-outline-variant rounded-lg font-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="••••••••" type="password"/>
                                    </div>
                                </div>
                                <button type="submit" className="w-full py-4 bg-primary text-white font-button text-button rounded-lg hover:bg-primary-container transition-all shadow-md active:scale-[0.98] mt-stack-sm">
                                    Login
                                </button>
                            </form>
                            
                            <div className="relative flex items-center py-2">
                                <div className="flex-grow border-t border-outline-variant"></div>
                                <span className="flex-shrink mx-4 font-label-caps text-label-caps text-outline">NEW TO CAMPUS?</span>
                                <div className="flex-grow border-t border-outline-variant"></div>
                            </div>
                            <Link to="/register" className="block text-center w-full py-3 border border-outline text-primary font-button text-button rounded-lg hover:bg-surface-container-low transition-all active:scale-[0.98]">
                                Create Student Account
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Login;
