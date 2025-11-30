import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/Contexts';
import { Card, Input, Button, Captcha } from '../components/UI'; // Added Captcha import

export const Login = ({ onNavigate }) => {
  const { login } = useContext(AuthContext);
  const [data, setData] = useState({ email: '', password: '' });
  const [captchaValid, setCaptchaValid] = useState(false); // Captcha state
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e) => { 
    e.preventDefault(); 
    setFormError('');

    if (!captchaValid) {
      setFormError('Please complete the captcha correctly.');
      return;
    }

    setLoading(true); 
    const success = await login(data.email, data.password);
    if (success) {
      onNavigate('dashboard');
    }
    setLoading(false); 
  };
  
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h2>
          <p className="text-gray-500">Sign in to your account</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <Input 
            label="Email" 
            type="email" 
            value={data.email} 
            onChange={e => setData({...data, email: e.target.value})} 
            placeholder="name@learn.hub"
            required 
          />
          <Input 
            label="Password" 
            type="password" 
            value={data.password} 
            onChange={e => setData({...data, password: e.target.value})} 
            required 
          />
          
          {/* CAPTCHA Component */}
          <Captcha onVerify={setCaptchaValid} />

          {formError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md">
              {formError}
            </div>
          )}

          <Button type="submit" className="w-full" loading={loading} disabled={!captchaValid}>
            Sign In
          </Button>
        </form>
        
        <p className="text-center mt-4 text-sm text-gray-500 cursor-pointer hover:underline" onClick={() => onNavigate('register')}>Create an account</p>
        
        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 text-xs text-center text-gray-400">
          <p className="font-semibold mb-1">Demo Credentials:</p>
          <p>Admin: admin@learn.hub / password</p>
          <p>Student: student@learn.hub / password</p>
        </div>
      </Card>
    </div>
  );
};

export const Register = ({ onNavigate }) => {
  const { register } = useContext(AuthContext);
  const [data, setData] = useState({ name: '', email: '', password: '', role: 'student' });
  const [captchaValid, setCaptchaValid] = useState(false); // Captcha state
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!/^[a-zA-Z\s]+$/.test(data.name)) {
      newErrors.name = "Name must contain only letters and spaces.";
    }
    if (!data.email.endsWith('@learn.hub')) {
      newErrors.email = "Email must belong to the @learn.hub domain.";
    }
    if (data.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => { 
    e.preventDefault(); 
    
    if (!validate()) return;
    if (!captchaValid) {
      setErrors(prev => ({ ...prev, general: 'Please complete the captcha' }));
      return;
    }

    setLoading(true); 
    const success = await register(data.name, data.email, data.password, data.role);
    if (success) {
      onNavigate('login'); 
    }
    setLoading(false); 
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">Create Account</h2>
        <form onSubmit={handleSubmit}>
          <Input 
            label="Full Name" 
            value={data.name} 
            onChange={e => setData({...data, name: e.target.value})} 
            error={errors.name}
            placeholder="John Doe (Letters only)"
            required 
          />
          <Input 
            label="Email" 
            type="email" 
            value={data.email} 
            onChange={e => setData({...data, email: e.target.value})} 
            error={errors.email}
            placeholder="student@learn.hub"
            required 
          />
          <Input 
            label="Password" 
            type="password" 
            value={data.password} 
            onChange={e => setData({...data, password: e.target.value})} 
            error={errors.password}
            required 
          />
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <button type="button" onClick={() => setData({...data, role: 'student'})} className={`p-2 border rounded ${data.role === 'student' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-200 dark:border-gray-700'} dark:text-white transition-colors`}>Student</button>
            <button type="button" onClick={() => setData({...data, role: 'admin'})} className={`p-2 border rounded ${data.role === 'admin' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-200 dark:border-gray-700'} dark:text-white transition-colors`}>Educator</button>
          </div>
          
          {/* CAPTCHA Component */}
          <Captcha onVerify={setCaptchaValid} />
          
          {errors.general && <p className="text-red-500 text-sm mb-4 text-center">{errors.general}</p>}

          <Button type="submit" className="w-full" loading={loading} disabled={!captchaValid}>Sign Up</Button>
        </form>
        <p className="text-center mt-4 text-sm text-gray-500 cursor-pointer hover:underline" onClick={() => onNavigate('login')}>Already have an account?</p>
      </Card>
    </div>
  );
};