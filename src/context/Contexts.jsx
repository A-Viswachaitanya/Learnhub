import React, { useState, useEffect, createContext, useContext } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { api, initializeDB, STORAGE_KEYS } from '../services/api';

// Create Contexts
export const AuthContext = createContext(null);
export const ToastContext = createContext(null);
export const ThemeContext = createContext(null);

// --- Theme Provider ---
export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(localStorage.getItem(STORAGE_KEYS.THEME) === 'dark');
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) { 
      root.classList.add('dark'); 
      localStorage.setItem(STORAGE_KEYS.THEME, 'dark'); 
    } else { 
      root.classList.remove('dark'); 
      localStorage.setItem(STORAGE_KEYS.THEME, 'light'); 
    }
  }, [isDark]);
  return <ThemeContext.Provider value={{ isDark, toggleTheme: () => setIsDark(!isDark) }}>{children}</ThemeContext.Provider>;
};

// --- Toast Provider ---
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };
  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`px-4 py-3 rounded-lg shadow-lg text-white flex items-center gap-2 animate-slide-up pointer-events-auto ${t.type === 'success' ? 'bg-green-600' : (t.type === 'error' ? 'bg-red-600' : 'bg-blue-600')}`}>
            {t.type === 'success' ? <CheckCircle size={18} /> : (t.type === 'error' ? <XCircle size={18} /> : <AlertCircle size={18} />)}
            <span className="text-sm font-medium">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// --- Auth Provider ---
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useContext(ToastContext);

  useEffect(() => {
    initializeDB();
    const storedUser = api.getSession();
    if (storedUser) setUser(storedUser);
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const userData = await api.login(email, password);
      setUser(userData);
      addToast(`Welcome back, ${userData.name}!`);
      return true;
    } catch (error) {
      addToast(error.message, 'error');
      return false;
    }
  };

  const register = async (name, email, password, role) => {
    try {
      await api.register(name, email, password, role);
      addToast('Registration successful! Please login.');
      return true;
    } catch (error) {
      addToast(error.message, 'error');
      return false;
    }
  };

  const updateProfile = async (data) => {
    try {
      const updatedUser = await api.updateProfile(user.id, data);
      setUser(updatedUser);
      addToast('Profile updated!');
    } catch(e) { addToast(e.message, 'error'); }
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
    addToast('Logged out successfully');
  };

  return <AuthContext.Provider value={{ user, login, register, logout, updateProfile, loading }}>{!loading && children}</AuthContext.Provider>;
};