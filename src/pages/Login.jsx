import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function Login() {
  const { login, loading, user } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isFillingForm, setIsFillingForm] = useState(false);

  if (user) navigate('/');

  const handleLogin = async (e, credentials = null) => {
    if (e) e.preventDefault();
    setError('');
    try {
      const { username: user, password: pass } = credentials || { username, password };
      console.log('Login attempt:', user, pass);
      await login(user, pass);
      navigate('/');
    } catch (e) {
      setError(e.message || 'Login failed');
    }
  };

  const handleAdminLogin = () => {
    setError('');
    setIsFillingForm(true);
    setUsername('admin');
    setPassword('admin123');
    // Use setTimeout to show form filling animation, then login with direct credentials
    setTimeout(() => {
      setIsFillingForm(false);
      handleLogin(null, { username: 'admin', password: 'admin123' });
    }, 100);
  };

  const handleManagerLogin = () => {
    setError('');
    setIsFillingForm(true);
    setUsername('manager');
    setPassword('manager123');
    // Use setTimeout to show form filling animation, then login with direct credentials
    setTimeout(() => {
      setIsFillingForm(false);
      handleLogin(null, { username: 'manager', password: 'manager123' });
    }, 100);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Content */}
      <div className="hidden lg:flex lg:w-1/2 bg-teal relative overflow-hidden">
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="mb-8">
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <div className="text-6xl font-black text-white">KVA</div>
              </div>
              <div className="text-lg font-medium text-white text-opacity-90 tracking-wide">ENTERPRISE</div>
            </div>
            <h1 className="text-5xl font-bold mb-4 leading-tight">
              Welcome to Your<br />Inventory System
            </h1>
            <p className="text-xl text-white text-opacity-90 leading-relaxed">
              Manage your stocks, stores, and godowns with ease. Track everything in real-time with our modern dashboard.
            </p>
          </div>
          <div className="space-y-4 mt-8">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-white bg-opacity-20 flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Real-time Tracking</h3>
                <p className="text-white text-opacity-80">Monitor your inventory levels instantly</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-white bg-opacity-20 flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Comprehensive Reports</h3>
                <p className="text-white text-opacity-80">Generate detailed analytics and insights</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-white bg-opacity-20 flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Multi-location Support</h3>
                <p className="text-white text-opacity-80">Manage multiple stores and godowns</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 px-8 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8">
            <div className="flex items-center gap-2">
              <div className="text-4xl font-black text-teal">KVA</div>
            </div>
            <div className="text-sm font-medium text-gray-600 tracking-wide">ENTERPRISE</div>
          </div>

          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-black mb-2">Sign In</h2>
              <p className="text-gray-600">Enter your credentials to access your account</p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-black mb-2">Username</label>
                <input 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-black focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal focus:ring-opacity-20 transition-all" 
                  placeholder="Enter your username" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 pr-12 text-black focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal focus:ring-opacity-20 transition-all" 
                    placeholder="Enter your password" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-teal transition-colors p-1"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {!showPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading} 
                className="w-full rounded-xl bg-teal text-white py-3.5 font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-600">Or quick login as</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <button
                  onClick={handleAdminLogin}
                  disabled={loading || isFillingForm}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-gray-200 text-black font-medium hover:border-teal hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                  </svg>
                  {isFillingForm ? 'Filling...' : 'Admin'}
                </button>
                <button
                  onClick={handleManagerLogin}
                  disabled={loading || isFillingForm}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-gray-200 text-black font-medium hover:border-teal hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  {isFillingForm ? 'Filling...' : 'Manager'}
                </button>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-gray-600 mt-6">
            © 2025 KVA Enterprise. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}


