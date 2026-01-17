import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import { Input, Button } from '../components/shared/ui';
import useAuthContext from '../context/useAuthContext';
import googleLogo from '../assets/google.svg';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { signIn, signInWithGoogle } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    const { error } = await signIn(email, password);
    if (error) {
      setErrorMessage(error.message);
      return;
    }
    const nextPath = location.state?.from || '/account';
    navigate(nextPath);
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    const { error } = await signInWithGoogle();
    if (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to save progress, inputs, and preferences."
      footer={
        <>
          New here?{' '}
          <Link to="/signup" className="text-zinc-900 dark:text-white font-semibold">
            Create an account
          </Link>
        </>
      }
    >
      <div className="space-y-4">
        <Button
          type="button"
          variant="default"
          className="w-full flex items-center justify-center gap-2"
          onClick={handleGoogleSignIn}
        >
          <img
            src={googleLogo}
            alt="Google"
            className="h-4 w-4 shrink-0"
          />
          <span className="relative top-px">Continue with Google</span>
        </Button>
        <div className="flex items-center gap-3 text-xs text-zinc-400">
          <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-700" />
          <span>or</span>
          <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-700" />
        </div>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@dsavisualizer.com"
          required
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
        {errorMessage && <div className="text-xs text-rose-500">{errorMessage}</div>}
        <Button type="submit" variant="primary" className="w-full">
          Sign in
        </Button>
        <Link
          to="/forgot-password"
          className="block text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white text-center"
        >
          Forgot your password?
        </Link>
      </form>
    </AuthLayout>
  );
}
