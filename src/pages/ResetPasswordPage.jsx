import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import { Input, Button } from '../components/shared/ui';
import { supabase } from '../lib/supabaseClient';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (!supabase) {
      setErrorMessage('Supabase client not configured.');
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setMessage('Password updated. You can now sign in.');
  };

  return (
    <AuthLayout
      title="Choose a new password"
      subtitle="Set a new password for your account."
      footer={
        <>
          Back to{' '}
          <Link to="/login" className="text-zinc-900 dark:text-white font-semibold">
            sign in
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          label="New password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter a new password"
          required
        />
        <Input
          label="Confirm new password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-enter your password"
          required
        />
        {errorMessage && <div className="text-xs text-rose-500">{errorMessage}</div>}
        {message && <div className="text-xs text-emerald-600">{message}</div>}
        <Button type="submit" variant="primary" className="w-full">
          Update password
        </Button>
      </form>
    </AuthLayout>
  );
}
