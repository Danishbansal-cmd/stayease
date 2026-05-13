"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/lib/store/hooks';
import { setCredentials } from '@/lib/store/features/authSlice';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (!res.ok) {
        console.log("err ", data)
        throw new Error(data.message || 'Login failed');
      }

      // Dispatch user to Redux store
      if (data.data?.user) {
        dispatch(setCredentials({ user: data.data.user }));
      }

      // If login successful, token is set in cookies by backend
      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form id="login-form" onSubmit={handleSubmit}>
      <div className="grid w-full items-center gap-5">
        {error && <div className="text-red-400 text-sm text-center">{error}</div>}
        <div className="flex flex-col space-y-2">
          <Label htmlFor="email" className="text-zinc-200">Email Address</Label>
          <Input 
            type="email" 
            id="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="bg-black/20 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-cyan-400 focus-visible:ring-offset-0 h-12 rounded-none"
            required 
          />
        </div>
        
        <div className="flex flex-col space-y-2">
          <Label htmlFor="password" className="text-zinc-200">Password</Label>
          <Input 
            type="password" 
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="bg-black/20 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-cyan-400 focus-visible:ring-offset-0 h-12 rounded-none"
            required 
          />
        </div>
        
        <Button disabled={loading} type="submit" id="login-submit-button" className="w-full h-12 mt-2 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-semibold rounded-none hover:opacity-90 transition-opacity border-0 shadow-[0_4px_15px_rgba(34,211,238,0.3)] hover:shadow-[0_6px_20px_rgba(34,211,238,0.4)] text-base">
          {loading ? 'Logging in...' : 'Log In'}
        </Button>
      </div>
    </form>
  );
}
