'use client';

import React from 'react';
import { useActionState } from 'react';
import { createFolierer, FormState } from '@/app/dashboard/admin/users/actions/foliererActions';
import { SubmitButton } from '@/components/buttons/submit-button';

const initialState: FormState = { message: '', errors: {} };

export function CreateFoliererForm() {
    const [state, dispatch] = useActionState(createFolierer, initialState);

  return (
    <form action={dispatch} className="space-y-8">
      <div className="border-b border-gray-900/10 pb-8">
        <h2 className="text-xl font-semibold leading-7 text-gray-900">Folierer anlegen</h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Füllen Sie die Details aus, um einen neuen Benutzer mit der Rolle 'Folierer' zu erstellen.
        </p>
      </div>

      {/* Section 1: User Account */}
      <div className="border-b border-gray-900/10 pb-8">
        <h3 className="text-base font-semibold leading-7 text-gray-900">Benutzerkonto</h3>
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-4">
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">E-Mail-Adresse</label>
            <input type="email" name="email" id="email" required className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6" />
            {state.errors?.email && <p className="mt-2 text-sm text-red-500">{state.errors.email}</p>}
          </div>
          <div className="sm:col-span-4">
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Passwort</label>
            <input type="password" name="password" id="password" required className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6" />
            {state.errors?.password && <p className="mt-2 text-sm text-red-500">{state.errors.password}</p>}
          </div>
        </div>
      </div>

      {/* Section 2: Company and Profile Data */}
      <div className="border-b border-gray-900/10 pb-8">
        <h3 className="text-base font-semibold leading-7 text-gray-900">Firmendetails & Profil</h3>
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-4">
            <label htmlFor="firma" className="block text-sm font-medium leading-6 text-gray-900">Firma</label>
            <input type="text" name="firma" id="firma" required className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600" />
            {state.errors?.firma && <p className="mt-2 text-sm text-red-500">{state.errors.firma}</p>}
          </div>
          <div className="sm:col-span-3">
            <label htmlFor="website" className="block text-sm font-medium leading-6 text-gray-900">Website</label>
            <input type="url" name="website" id="website" placeholder="https://..." className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600" />
             {state.errors?.website && <p className="mt-2 text-sm text-red-500">{state.errors.website}</p>}
          </div>
          <div className="sm:col-span-3">
            <label htmlFor="phone_number" className="block text-sm font-medium leading-6 text-gray-900">Telefonnummer</label>
            <input type="tel" name="phone_number" id="phone_number" className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600" />
          </div>
        </div>
      </div>

      {/* Section 3: Address */}
      <div>
        <h3 className="text-base font-semibold leading-7 text-gray-900">Adresse</h3>
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="col-span-full">
            <label htmlFor="adresse" className="block text-sm font-medium leading-6 text-gray-900">Adresse (Straße und Hausnummer)</label>
            <input type="text" name="adresse" id="adresse" required className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600" />
            {state.errors?.adresse && <p className="mt-2 text-sm text-red-500">{state.errors.adresse}</p>}
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="plz" className="block text-sm font-medium leading-6 text-gray-900">PLZ</label>
            <input type="text" name="plz" id="plz" required className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600" />
            {state.errors?.plz && <p className="mt-2 text-sm text-red-500">{state.errors.plz}</p>}
          </div>
          <div className="sm:col-span-4">
            <label htmlFor="ort" className="block text-sm font-medium leading-6 text-gray-900">Ort</label>
            <input type="text" name="ort" id="ort" required className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600" />
            {state.errors?.ort && <p className="mt-2 text-sm text-red-500">{state.errors.ort}</p>}
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-end gap-x-6">
        <SubmitButton text="Folierer erstellen" />
      </div>

      {state.message && (
        <div aria-live="polite" className="mt-4 text-sm text-red-600">
          <p>{state.message}</p>
        </div>
      )}
    </form>
  );
}
