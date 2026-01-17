import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import { Input, Button } from '../components/shared/ui';
import useAuthContext from '../context/useAuthContext';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { signUp } = useAuthContext();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      return;
    }
    setErrorMessage('');
    setSuccessMessage('');
    const { error, needsEmailConfirmation } = await signUp(email, password);
    if (error) {
      setErrorMessage(error.message);
      return;
    }
    if (needsEmailConfirmation) {
      setSuccessMessage('Check your email to confirm your account, then sign in.');
      return;
    }
    navigate('/account');
  };

  const passwordMismatch = password && confirmPassword && password !== confirmPassword;

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Unlock saved inputs, preferences, and progress tracking."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="text-zinc-900 dark:text-white font-semibold">
            Sign in
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
          placeholder="Create a strong password"
          required
        />
        <Input
          label="Confirm password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-enter your password"
          required
        />
        {passwordMismatch && (
          <div className="text-xs text-rose-500">Passwords do not match.</div>
        )}
        {errorMessage && <div className="text-xs text-rose-500">{errorMessage}</div>}
        {successMessage && <div className="text-xs text-emerald-600">{successMessage}</div>}
        <Button type="submit" variant="primary" className="w-full" disabled={passwordMismatch}>
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
}
