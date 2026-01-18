import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import { Input, Button } from '../components/shared/ui';
import { supabase } from '../lib/supabaseClient';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setErrorMessage('');

    if (!supabase) {
      setErrorMessage('Supabase client not configured.');
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setMessage('Check your email for a password reset link.');
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="We will email you a secure link to set a new password."
      footer={
        <>
          Remembered your password?{' '}
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
          placeholder="support@algorithmicai.dev"
          required
        />
        {errorMessage && <div className="text-xs text-rose-500">{errorMessage}</div>}
        {message && <div className="text-xs text-emerald-600">{message}</div>}
        <Button type="submit" variant="primary" className="w-full">
          Send reset link
        </Button>
      </form>
    </AuthLayout>
  );
}
