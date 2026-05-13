"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/lib/store/hooks';
import { setCredentials } from '@/lib/store/features/authSlice';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function SignupForm() {
  const [name, setName] = useState('');
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
      // First create user
      const res = await fetch('/api/v1/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role: 'GUEST' })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      // Then log them in automatically
      const loginRes = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!loginRes.ok) {
        router.push('/login');
        return;
      }
      
      const loginData = await loginRes.json();
      
      if (loginData.data?.user) {
        dispatch(setCredentials({ user: loginData.data.user }));
      }

      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form id="signup-form" onSubmit={handleSubmit}>
      <div className="grid w-full items-center gap-5">
        {error && <div className="text-red-400 text-sm text-center">{error}</div>}
        <div className="flex flex-col space-y-2">
          <Label htmlFor="name" className="text-zinc-200">Full Name</Label>
          <Input 
            type="text" 
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="bg-black/20 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-cyan-400 focus-visible:ring-offset-0 h-12 rounded-none"
            required 
          />
        </div>

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
            minLength={8}
          />
        </div>
        
        <Button disabled={loading} type="submit" id="signup-submit-button" className="w-full h-12 mt-2 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-semibold rounded-none hover:opacity-90 transition-opacity border-0 shadow-[0_4px_15px_rgba(34,211,238,0.3)] hover:shadow-[0_6px_20px_rgba(34,211,238,0.4)] text-base">
          {loading ? 'Signing up...' : 'Sign Up'}
        </Button>
      </div>
    </form>
  );
}
