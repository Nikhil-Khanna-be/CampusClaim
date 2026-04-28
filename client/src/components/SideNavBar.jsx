import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SideNavBar = ({ role }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 pt-20 pb-8 px-4 bg-gray-50 dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 font-public-sans text-sm font-semibold">
            <div className="mb-8 px-4">
                <div className="flex items-center gap-3 mb-2">
                    <span className="material-symbols-outlined text-primary text-3xl">school</span>
                    <div>
                        <div className="text-lg font-black text-red-800 dark:text-red-500">
                            {role === 'admin' ? 'Admin Portal' : 'Student Portal'}
                        </div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-wider">University Access</div>
                    </div>
                </div>
            </div>

            <nav className="flex-1 space-y-1">
                <Link to={role === 'admin' ? '/admin' : '/dashboard'} className="flex items-center gap-3 px-4 py-3 bg-red-50 text-red-800 rounded-lg">
                    <span className="material-symbols-outlined">dashboard</span>
                    <span>Overview</span>
                </Link>
                {role === 'student' ? (
                    <>
                        <Link to="/browse-found" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200">
                            <span className="material-symbols-outlined">search</span>
                            <span>Found Catalog</span>
                        </Link>
                        <Link to="/report-lost" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200">
                            <span className="material-symbols-outlined">add_circle</span>
                            <span>New Report</span>
                        </Link>
                        <Link to="/my-claims" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200">
                            <span className="material-symbols-outlined">assignment</span>
                            <span>My Claims</span>
                        </Link>
                    </>
                ) : (
                    <>
                        <Link to="/admin/add-found" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200">
                            <span className="material-symbols-outlined">add_box</span>
                            <span>Add Found Item</span>
                        </Link>
                        <Link to="/admin/manage-claims" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200">
                            <span className="material-symbols-outlined">checklist</span>
                            <span>Manage Claims</span>
                        </Link>
                    </>
                )}
            </nav>

            <div className="mt-auto space-y-4">
                <button className="w-full py-3 px-4 bg-primary text-on-primary rounded-lg font-button flex items-center justify-center gap-2 hover:bg-red-900 transition-colors">
                    Help Center
                </button>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200">
                    <span className="material-symbols-outlined">logout</span>
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default SideNavBar;
