/* eslint-disable */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PasswordProtectPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/password-protect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      // Redirect to the originally requested page, or home page
      const url = new URL(window.location.href);
      const redirectUrl = url.searchParams.get('redirect') || '/';
      router.push(redirectUrl);
      router.refresh(); // Refresh to apply new cookie state
    } else {
      setError('Falsches Passwort. Bitte versuchen Sie es erneut.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-sm p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center">Seite geschützt</h1>
        <p className="text-center text-gray-400">Bitte geben Sie das Passwort ein, um fortzufahren.</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="sr-only">Passwort</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Passwort"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500"
            >
              Zugang
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
