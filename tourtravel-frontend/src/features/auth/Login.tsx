import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { api } from '@/services/api';
import { Mail, Phone, ArrowRight, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export function Login() {
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);

  const from = location.state?.from?.pathname || '/';

  const handleLoginSuccess = (data: any) => {
    login(data.user, data.accessToken, data.refreshToken);
    navigate(from, { replace: true });
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      handleLoginSuccess(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const formattedPhone = phone.startsWith('+') ? phone : (phone.length === 10 ? `+91${phone}` : phone);
      await api.post('/auth/otp/send', { phone: formattedPhone });
      setOtpSent(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const formattedPhone = phone.startsWith('+') ? phone : (phone.length === 10 ? `+91${phone}` : phone);
      const res = await api.post('/auth/otp/verify', { phone: formattedPhone, otp });
      handleLoginSuccess(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card p-8 rounded-2xl shadow-xl w-full border border-border"
    >
      <div className="flex gap-4 mb-8 border-b pb-4">
        <button
          onClick={() => { setMethod('email'); setError(''); }}
          className={`flex-1 pb-2 font-medium ${method === 'email' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
        >
          Email
        </button>
        <button
          onClick={() => { setMethod('phone'); setError(''); }}
          className={`flex-1 pb-2 font-medium ${method === 'phone' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
        >
          Phone & OTP
        </button>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-6 text-sm border border-destructive/20">
          {error}
        </div>
      )}

      {method === 'email' ? (
        <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="email"
              placeholder="Email address"
              required
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-foreground"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              required
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-foreground"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in with Email'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      ) : (
        <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="flex flex-col gap-4">
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="tel"
              placeholder="Phone number"
              required
              disabled={otpSent}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary disabled:opacity-50 focus:border-transparent outline-none transition-all text-foreground"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          {otpSent && (
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                required
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-foreground"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
          )}
          <button 
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Processing...' : (otpSent ? 'Verify OTP' : 'Send OTP')}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      )}

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>Or continue with OAuth</p>
        <a 
          href="http://localhost:8085/api/v1/auth/oauth2/authorize/google" 
          className="mt-4 w-full flex items-center justify-center gap-2 border border-border py-2.5 rounded-lg font-medium hover:bg-secondary transition-colors text-foreground"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
          Sign in with Google
        </a>
      </div>
    </motion.div>
  );
}
