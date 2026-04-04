import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { api } from '@/services/api';
import { Loader2 } from 'lucide-react';

export function OAuth2Callback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const isProcessing = useRef(false);

  useEffect(() => {
    const handleCallback = async () => {
      if (isProcessing.current) return;
      isProcessing.current = true;

      const token = searchParams.get('token');
      const refreshToken = searchParams.get('refreshToken');

      if (!token || !refreshToken) {
        console.error('Missing tokens in OAuth2 callback');
        navigate('/login', { replace: true });
        return;
      }

      try {
        // We set tokens first so that the interceptors can use them for the /me call
        useAuthStore.getState().setTokens(token, refreshToken);

        // Fetch user profile
        const res = await api.get('/auth/me');
        const userData = res.data.data;

        // Re-login with full user data
        login(userData, token, refreshToken);
        
        navigate('/', { replace: true });
      } catch (error) {
        console.error('OAuth2 login verification failed:', error);
        navigate('/login', { replace: true, state: { error: 'Failed to verify account' } });
      }
    };

    handleCallback();
  }, [searchParams, navigate, login]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
      <Loader2 className="h-12 w-12 text-primary animate-spin" />
      <div className="text-center">
        <h2 className="text-2xl font-black text-slate-800 italic tracking-tighter">AUTHENTICATING</h2>
        <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mt-2">Setting up your profile...</p>
      </div>
    </div>
  );
}
