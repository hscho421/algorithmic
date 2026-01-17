import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import { Input, Button } from '../components/shared/ui';
import useAuthContext from '../context/useAuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { signIn } = useAuthContext();
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
