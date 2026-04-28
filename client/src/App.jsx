import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ReportLostItem from './pages/ReportLostItem';
import BrowseFoundItems from './pages/BrowseFoundItems';
import ClaimItem from './pages/ClaimItem';
import MyClaims from './pages/MyClaims';
import AddFoundItem from './pages/AddFoundItem';
import ManageClaims from './pages/ManageClaims';
import ManageFoundItems from './pages/ManageFoundItems';
import ManageLostItems from './pages/ManageLostItems';
// Default layouts
import TopNavBar from './components/TopNavBar';
import SideNavBar from './components/SideNavBar';

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) {
     return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/dashboard" element={
            <PrivateRoute role="student">
              <div className="flex min-h-screen font-body-lg bg-surface-container-low">
                 <SideNavBar role="student" />
                 <div className="flex-1 lg:ml-64 flex flex-col overflow-x-hidden">
                    <TopNavBar />
                    <StudentDashboard />
                 </div>
              </div>
            </PrivateRoute>
          } />

          <Route path="/report-lost" element={
            <PrivateRoute role="student">
              <div className="flex min-h-screen font-body-lg bg-surface-container-low">
                 <SideNavBar role="student" />
                 <div className="flex-1 lg:ml-64 flex flex-col overflow-x-hidden">
                    <TopNavBar />
                    <ReportLostItem />
                 </div>
              </div>
            </PrivateRoute>
          } />

          <Route path="/browse-found" element={
            <PrivateRoute role="student">
              <div className="flex min-h-screen font-body-lg bg-surface-container-low">
                 <SideNavBar role="student" />
                 <div className="flex-1 lg:ml-64 flex flex-col overflow-x-hidden">
                    <TopNavBar />
                    <BrowseFoundItems />
                 </div>
              </div>
            </PrivateRoute>
          } />

          <Route path="/my-claims" element={
            <PrivateRoute role="student">
              <div className="flex min-h-screen font-body-lg bg-surface-container-low">
                 <SideNavBar role="student" />
                 <div className="flex-1 lg:ml-64 flex flex-col overflow-x-hidden">
                    <TopNavBar />
                    <MyClaims />
                 </div>
              </div>
            </PrivateRoute>
          } />

          <Route path="/claim/:id" element={
            <PrivateRoute role="student">
              <div className="flex min-h-screen font-body-lg bg-surface-container-low">
                 <SideNavBar role="student" />
                 <div className="flex-1 lg:ml-64 flex flex-col overflow-x-hidden">
                    <TopNavBar />
                    <ClaimItem />
                 </div>
              </div>
            </PrivateRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <PrivateRoute role="admin">
              <div className="flex min-h-screen font-body-lg bg-surface-container-low">
                 <SideNavBar role="admin" />
                 <div className="flex-1 lg:ml-64 flex flex-col overflow-x-hidden">
                    <TopNavBar />
                    <AdminDashboard />
                 </div>
              </div>
            </PrivateRoute>
          } />
          
          <Route path="/admin/add-found" element={
            <PrivateRoute role="admin">
              <div className="flex min-h-screen font-body-lg bg-surface-container-low">
                 <SideNavBar role="admin" />
                 <div className="flex-1 lg:ml-64 flex flex-col overflow-x-hidden">
                    <TopNavBar />
                    <AddFoundItem />
                 </div>
              </div>
            </PrivateRoute>
          } />

          <Route path="/admin/manage-claims" element={
            <PrivateRoute role="admin">
              <div className="flex min-h-screen font-body-lg bg-surface-container-low">
                 <SideNavBar role="admin" />
                 <div className="flex-1 lg:ml-64 flex flex-col overflow-x-hidden">
                    <TopNavBar />
                    <ManageClaims />
                 </div>
              </div>
            </PrivateRoute>
          } />

          <Route path="/admin/manage-found" element={
            <PrivateRoute role="admin">
              <div className="flex min-h-screen font-body-lg bg-surface-container-low">
                 <SideNavBar role="admin" />
                 <div className="flex-1 lg:ml-64 flex flex-col overflow-x-hidden">
                    <TopNavBar />
                    <ManageFoundItems />
                 </div>
              </div>
            </PrivateRoute>
          } />

          <Route path="/admin/manage-lost" element={
            <PrivateRoute role="admin">
              <div className="flex min-h-screen font-body-lg bg-surface-container-low">
                 <SideNavBar role="admin" />
                 <div className="flex-1 lg:ml-64 flex flex-col overflow-x-hidden">
                    <TopNavBar />
                    <ManageLostItems />
                 </div>
              </div>
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
