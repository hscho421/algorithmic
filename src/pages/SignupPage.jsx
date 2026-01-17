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
  const { signUp, signInWithGoogle } = useAuthContext();
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

  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    const { error } = await signInWithGoogle();
    if (error) {
      setErrorMessage(error.message);
    }
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
      <div className="space-y-4">
        <Button
          type="button"
          variant="default"
          className="w-full flex items-center justify-center gap-2"
          onClick={handleGoogleSignIn}
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
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
