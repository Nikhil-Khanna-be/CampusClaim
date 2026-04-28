import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TopNavBar = () => {
    const { user } = useAuth();
    
    return (
        <header className="bg-white dark:bg-gray-900 flex justify-between items-center w-full px-8 h-16 sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 shadow-sm dark:shadow-none">
            <div className="flex items-center gap-4 lg:hidden">
                <span className="text-xl font-bold text-red-800 dark:text-red-500 tracking-tight">Campus Claim</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-8 font-public-sans text-sm font-medium ml-auto lg:ml-0">
                {/* Responsive navigation links can go here or be hidden since they are in SideNav */}
                <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} className="text-gray-600 dark:text-gray-400 hover:text-red-800 transition-colors">Dashboard</Link>
            </nav>
            
            <div className="flex items-center gap-4 ml-auto">
                <button className="material-symbols-outlined text-gray-600 p-2 hover:bg-gray-50 rounded-md transition-all">notifications</button>
                <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant bg-gray-200 flex items-center justify-center text-primary font-bold">
                    {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </div>
            </div>
        </header>
    );
};

export default TopNavBar;
