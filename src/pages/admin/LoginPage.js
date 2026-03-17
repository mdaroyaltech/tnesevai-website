// src/pages/admin/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FaShieldAlt, FaEnvelope, FaLock, FaSignInAlt, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [email,   setEmail]   = useState('');
  const [pass,    setPass]    = useState('');
  const [showPw,  setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !pass) { toast.error('Enter email and password'); return; }
    setLoading(true);
    try {
      await login(email, pass);
      toast.success('Welcome back!');
      navigate('/admin');
    } catch (err) {
      toast.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-gov-dark flex items-center justify-center p-4">
      {/* Background circles */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full -translate-x-24 -translate-y-24 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-24 translate-y-24 pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-primary-700 to-primary-500 p-7 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
              <FaShieldAlt className="text-white text-2xl" />
            </div>
            <h1 className="font-display font-extrabold text-white text-xl">Admin Login</h1>
            <p className="text-primary-200 text-xs mt-1">Royal Computers · TNeSevai</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-7 space-y-4">
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@royalcomputers.in"
                  className="input-field pl-9"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={pass}
                  onChange={e => setPass(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-9 pr-10"
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPw ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 text-sm mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                <><FaSignInAlt /> Sign In</>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-primary-300 text-xs mt-4">
          © Royal Computers · Authorized Admin Portal
        </p>
      </div>
    </div>
  );
}
