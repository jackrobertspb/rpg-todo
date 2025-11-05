import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cn } from '@/lib/utils';

export default function Login() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(usernameOrEmail, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn(
      "min-h-screen flex items-center justify-center",
      "bg-primary dark:bg-primary-dark",
      "px-4"
    )}>
      <div className={cn(
        "w-full max-w-md p-8 rounded-lg",
        "bg-white dark:bg-primary",
        "shadow-lg"
      )}>
        <h1 className={cn(
          "text-3xl font-sans font-bold mb-6 text-center",
          "text-primary dark:text-white"
        )}>
          RPG Todo
        </h1>
        <h2 className="text-2xl font-sans font-bold mb-6 text-center text-primary dark:text-white">
          Login
        </h2>
        {error && (
          <div className={cn(
            "mb-4 p-3 rounded",
            "bg-red-100 dark:bg-red-900",
            "text-red-800 dark:text-red-200"
          )}>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-primary dark:text-white">
              Username or Email
            </label>
            <input
              type="text"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              required
              className={cn(
                "w-full px-4 py-2 rounded border",
                "border-primary dark:border-primary-light",
                "focus:outline-none focus:ring-2 focus:ring-secondary",
                "bg-white dark:bg-primary-dark",
                "text-primary dark:text-white"
              )}
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-primary dark:text-white">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={cn(
                "w-full px-4 py-2 rounded border",
                "border-primary dark:border-primary-light",
                "focus:outline-none focus:ring-2 focus:ring-secondary",
                "bg-white dark:bg-primary-dark",
                "text-primary dark:text-white"
              )}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={cn(
              "w-full py-2 rounded font-medium",
              "bg-secondary hover:bg-secondary-light",
              "text-white transition-colors",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-primary dark:text-white">
          Don't have an account?{' '}
          <Link to="/register" className="text-secondary hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}


