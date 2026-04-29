import Link from 'next/link';
import styles from '../auth.module.css';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Sign Up - StayEase',
  description: 'Create a StayEase account to start booking extraordinary homes or hosting guests.',
};

export default function SignupPage() {
  return (
    <div className={styles.container}>
      <Link href="/" className={styles.brand}>
        <span className={styles.brandIcon}>◆</span> StayEase
      </Link>
      
      <Card className="w-full max-w-[450px] bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] hover:-translate-y-1 transition-all duration-300 rounded-none overflow-hidden">
        <CardHeader className="text-center pb-6 pt-8">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Create Account
          </CardTitle>
          <CardDescription className="text-zinc-400 text-base">
            Join StayEase to discover extraordinary places
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form id="signup-form">
            <div className="grid w-full items-center gap-5">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="name" className="text-zinc-200">Full Name</Label>
                <Input 
                  type="text" 
                  id="name" 
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
                  placeholder="••••••••"
                  className="bg-black/20 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-cyan-400 focus-visible:ring-offset-0 h-12 rounded-none"
                  required 
                  minLength={8}
                />
              </div>
              
              <Button type="submit" id="signup-submit-button" className="w-full h-12 mt-2 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-semibold rounded-none hover:opacity-90 transition-opacity border-0 shadow-[0_4px_15px_rgba(34,211,238,0.3)] hover:shadow-[0_6px_20px_rgba(34,211,238,0.4)] text-base">
                Sign Up
              </Button>
            </div>
          </form>
        </CardContent>
        
        <CardFooter className="flex justify-center py-6 bg-black/40 border-t border-white/10 mt-6">
          <p className="text-sm text-zinc-400">
            Already have an account?{' '}
            <Link href="/login" id="link-to-login" className="text-cyan-400 hover:text-indigo-400 font-medium hover:underline transition-colors">
              Log in here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
