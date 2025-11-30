import React, { useState, useEffect } from 'react'; // Added hooks
import { Loader2, AlertTriangle, Star, RefreshCw } from 'lucide-react'; // Added RefreshCw

export const Button = ({ children, onClick, variant = 'primary', className = '', type = 'button', disabled = false, loading = false }) => {
  const baseStyles = "px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled || loading} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
};

export const Input = ({ label, type = 'text', value, onChange, placeholder, required, error, multiline, min, max }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label} {required && '*'}</label>
    {multiline ? (
       <textarea value={value} onChange={onChange} placeholder={placeholder} rows={4} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700 ${error ? 'border-red-500' : 'border-gray-300'}`} />
    ) : (
      <input type={type} min={min} max={max} value={value} onChange={onChange} placeholder={placeholder} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700 ${error ? 'border-red-500' : 'border-gray-300'}`} />
    )}
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

export const Card = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>{children}</div>
);

export const Badge = ({ children, color = 'blue' }) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    green: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    red: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color]}`}>{children}</span>;
};

export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, loading }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-sm p-6">
        <div className="flex items-center gap-3 text-red-600 mb-4">
          <AlertTriangle size={24} />
          <h2 className="text-xl font-bold dark:text-white">{title}</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>Delete</Button>
        </div>
      </Card>
    </div>
  );
};

export const SimpleBarChart = ({ data, total }) => {
  if (total === 0) return <div className="text-gray-500 text-sm italic">No ratings yet.</div>;

  return (
    <div className="space-y-2">
      {[5, 4, 3, 2, 1].map(star => {
        const count = data[star] || 0;
        const percent = (count / total) * 100;
        return (
          <div key={star} className="flex items-center gap-3 text-sm">
            <div className="flex items-center w-8 gap-1">
              <span className="font-bold dark:text-gray-300">{star}</span>
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
            </div>
            <div className="flex-1 h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${percent}%` }}></div>
            </div>
            <div className="w-8 text-right text-gray-500">{count}</div>
          </div>
        );
      })}
    </div>
  );
};

// NEW: Custom Captcha Component
export const Captcha = ({ onVerify }) => {
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');

  // Generate random 6-character code
  const generateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No confusing I, 1, O, 0
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCode(result);
    setInput('');
    onVerify(false); // Reset parent valid state
  };

  useEffect(() => {
    generateCode();
  }, []);

  const handleChange = (e) => {
    const val = e.target.value.toUpperCase();
    setInput(val);
    if (val === code) {
      onVerify(true);
    } else {
      onVerify(false);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Captcha *</label>
      <div className="flex items-center gap-3 mb-2">
        <div 
          className="flex-1 bg-gray-200 dark:bg-gray-700 select-none px-4 py-3 rounded-md font-mono text-xl font-bold tracking-[0.2em] text-center text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 relative overflow-hidden"
        >
          {/* Noise overlay simulation */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" 
               style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)', backgroundSize: '10px 10px', backgroundPosition: '0 0, 5px 5px' }}></div>
          {code}
        </div>
        <button 
          type="button" 
          onClick={generateCode} 
          className="p-3 text-gray-500 hover:text-blue-600 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 transition-colors"
          title="Refresh Code"
        >
          <RefreshCw size={20} />
        </button>
      </div>
      <input
        type="text"
        value={input}
        onChange={handleChange}
        placeholder="Enter the code shown above"
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700 border-gray-300 uppercase"
      />
    </div>
  );
};