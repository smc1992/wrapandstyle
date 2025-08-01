"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { addPortfolioImage } from '@/app/dashboard/folierer/portfolio/actions';

export default function PortfolioImageUploader() {
  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message: string }>({ type: 'idle', message: '' });
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus({ type: 'loading', message: 'Bild wird hochgeladen...' });

    const formData = new FormData(event.currentTarget);

    try {
      const result = await addPortfolioImage(formData);

      if (result.error) {
        setStatus({ type: 'error', message: result.error });
      } else {
        setStatus({ type: 'success', message: 'Bild erfolgreich hochgeladen!' });
        formRef.current?.reset();
        // Reload the page to show the new image
        router.refresh();
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Ein unerwarteter Fehler ist aufgetreten.' });
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Neues Portfolio-Bild hochladen</h3>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Titel</label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">Bilddatei</label>
          <input
            type="file"
            id="image"
            name="image"
            required
            accept="image/png, image/jpeg, image/webp"
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
          />
        </div>
        <button
          type="submit"
          disabled={status.type === 'loading'}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
        >
          {status.type === 'loading' ? 'Lädt...' : 'Hochladen'}
        </button>
      </form>
      {status.type !== 'idle' && (
        <div className={`mt-4 p-2 text-sm rounded-md ${status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {status.message}
        </div>
      )}
    </div>
  );
}