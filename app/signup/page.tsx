import Link from 'next/link';
import styles from '../auth.module.css';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { SignupForm } from '@/components/SignupForm';

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
          <SignupForm />
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
