import Link from 'next/link';
import styles from '../auth.module.css';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { LoginForm } from '@/components/LoginForm';

export const metadata = {
  title: 'Login - StayEase',
  description: 'Log in to your StayEase account to book your next adventure or manage your listings.',
};

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <Link href="/" className={styles.brand}>
        <span className={styles.brandIcon}>◆</span> StayEase
      </Link>
      
      <Card className="w-full max-w-[450px] bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] hover:-translate-y-1 transition-all duration-300 rounded-none overflow-hidden">
        <CardHeader className="text-center pb-6 pt-8">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-zinc-400 text-base">
            Enter your details to access your account
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <LoginForm />
        </CardContent>
        
        <CardFooter className="flex justify-center py-6 bg-black/40 border-t border-white/10 mt-6">
          <p className="text-sm text-zinc-400">
            Don't have an account?{' '}
            <Link href="/signup" id="link-to-signup" className="text-cyan-400 hover:text-indigo-400 font-medium hover:underline transition-colors">
              Sign up here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
