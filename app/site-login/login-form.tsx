'use client';

import { useSearchParams } from 'next/navigation';
import { verifyPassword } from './actions';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('next') || '/';
  const error = searchParams.get('error');

  return (
    <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-sm">
      <h1 className="text-2xl font-bold mb-4 text-center">Seite geschützt</h1>
      <p className="mb-6 text-center text-gray-600">Bitte geben Sie das Passwort ein, um fortzufahren.</p>
      <form action={verifyPassword}>
        <input type="hidden" name="next" value={nextUrl} />
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 sr-only">
            Passwort
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Passwort"
          />
        </div>
        {error && <p className="text-red-500 text-sm text-center mb-4">Falsches Passwort.</p>}
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Zugang
        </button>
      </form>
    </div>
  );
}
