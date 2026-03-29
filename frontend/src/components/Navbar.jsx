import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, LayoutDashboard, Search, Settings } from 'lucide-react';
import authService from '../services/auth.service';

const Navbar = () => {
  console.log("Navbar rendering");
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  console.log("Current User:", currentUser);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!currentUser) return '/';
    if (currentUser.roles.includes('ROLE_ADMIN')) return '/admin/dashboard';
    if (currentUser.roles.includes('ROLE_PROVIDER')) return '/provider/dashboard';
    return '/customer/dashboard';
  };

  return (
    <nav className="glass sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-xl group-hover:bg-primary-500 transition-colors">
                SC
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900 group-hover:text-primary-600 transition-colors">
                ServiceConnect
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {currentUser ? (
              <>
                <Link
                  to="/services"
                  className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1 transition-colors"
                >
                  <Search size={16} /> Find Services
                </Link>
                <Link
                  to={getDashboardLink()}
                  className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1 transition-colors"
                >
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
                
                <div className="h-6 w-px bg-gray-200 mx-2"></div>
                
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-medium text-gray-900 leading-none">{currentUser.username}</span>
                    <span className="text-xs text-gray-500">{currentUser.roles[0].replace('ROLE_', '')}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md active:scale-95"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
