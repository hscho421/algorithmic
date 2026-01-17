import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import { Input, Button } from '../components/shared/ui';
import useAuthContext from '../context/useAuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (event) => {
    event.preventDefault();
    signIn(email || 'demo@dsavisualizer.com');
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
        <Button type="submit" variant="primary" className="w-full">
          Sign in
        </Button>
      </form>
    </AuthLayout>
  );
}
