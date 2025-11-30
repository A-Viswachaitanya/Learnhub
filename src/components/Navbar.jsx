import React, { useState, useContext } from 'react';
import { GraduationCap, LogOut, Menu, X, Moon, Sun } from 'lucide-react';
import { AuthContext, ThemeContext } from '../context/Contexts';
import { Button } from './UI';

const Navbar = ({ onNavigate }) => {
  const { user, logout } = useContext(AuthContext);
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const [menuOpen, setMenuOpen] = useState(false);
  
  const NavItem = ({ label, page }) => (
    <button 
      onClick={() => { onNavigate(page); setMenuOpen(false); }} 
      className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      {label}
    </button>
  );

  return (
    <nav className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate(user ? 'dashboard' : 'login')}>
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">LearnHub</span>
          </div>
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {user ? (
              <>
                <Button variant="ghost" onClick={() => onNavigate('dashboard')}>Dashboard</Button>
                {user.role === 'admin' ? (
                  <>
                    <Button variant="ghost" onClick={() => onNavigate('admin-courses')}>Courses</Button>
                    <Button variant="ghost" onClick={() => onNavigate('admin-students')}>Students</Button>
                  </>
                ) : <Button variant="ghost" onClick={() => onNavigate('student-browse')}>Browse</Button>}
                <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-2"></div>
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('profile')}>
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold">{user.name[0]}</div>
                </div>
                <Button variant="secondary" onClick={() => { logout(); onNavigate('login'); }}><LogOut size={16} /></Button>
              </>
            ) : <div className="flex gap-2"><Button variant="ghost" onClick={() => onNavigate('login')}>Login</Button><Button variant="primary" onClick={() => onNavigate('register')}>Sign Up</Button></div>}
          </div>
          <div className="flex items-center sm:hidden"><button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-gray-600 dark:text-gray-300">{menuOpen ? <X /> : <Menu />}</button></div>
        </div>
      </div>
      {menuOpen && (
        <div className="sm:hidden bg-white dark:bg-gray-800 border-b dark:border-gray-700">
          <div className="pt-2 pb-3 space-y-1">
            <div className="px-4 py-2 flex justify-between items-center">
              <span className="text-gray-500 dark:text-gray-400">Dark Mode</span>
              <button onClick={toggleTheme} className="p-1">{isDark ? <Sun size={18}/> : <Moon size={18}/>}</button>
            </div>
            {user ? (
              <>
                <NavItem label="Dashboard" page="dashboard" />
                <NavItem label="My Profile" page="profile" />
                {user.role === 'admin' ? (
                  <>
                    <NavItem label="Manage Courses" page="admin-courses" />
                    <NavItem label="Manage Students" page="admin-students" />
                  </>
                ) : <NavItem label="Browse Courses" page="student-browse" />}
                <button onClick={() => { logout(); onNavigate('login'); }} className="block w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">Sign Out</button>
              </>
            ) : (
              <>
                <NavItem label="Login" page="login" />
                <NavItem label="Register" page="register" />
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;