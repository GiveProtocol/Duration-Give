import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { validateEmail } from '@/utils/validation';

type ForgotType = 'password' | 'username';

interface ForgotCredentialsProps {
  type: ForgotType;
  onBack: () => void;
}

export const ForgotCredentials: React.FC<ForgotCredentialsProps> = ({ type, onBack }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const { resetPassword, sendUsernameReminder, loading } = useAuth();

  const isPassword = type === 'password';
  const title = isPassword ? 'Reset Password' : 'Forgot Username';
  const description = isPassword 
    ? 'Enter your email address and we\'ll send you a link to reset your password.'
    : 'Enter your email address and we\'ll send you your username.';
  const successMessage = isPassword
    ? 'Password reset instructions sent to your email'
    : 'Username reminder sent to your email';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      if (isPassword) {
        await resetPassword(email);
      } else {
        await sendUsernameReminder(email);
      }
      setSubmitted(true);
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="text-center">
        <div className="mb-4">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Check your email</h3>
        <p className="text-sm text-gray-600 mb-6">{successMessage}</p>
        <Button onClick={onBack} variant="outline" className="w-full">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Sign In
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Button onClick={onBack} variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Sign In
        </Button>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-600 mt-2">{description}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
            required
          />
        </div>

        {error && (
          <div className="text-sm text-red-600">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Sending...' : `Send ${isPassword ? 'Reset Link' : 'Username'}`}
        </Button>
      </form>
    </div>
  );
};