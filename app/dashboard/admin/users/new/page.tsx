import Link from 'next/link';
import { Building, User, Store } from 'lucide-react';

export default function NewUserSelectionPage() {
  return (
    <div className="w-full max-w-2xl mx-auto py-8">
      <div className="flex w-full items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Neuen Benutzer anlegen</h1>
      </div>
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Wählen Sie eine Benutzerrolle</h2>
        <p className="text-sm text-gray-600 mb-6">
          Wählen Sie die Rolle des neuen Benutzers, den Sie erstellen möchten. Jede Rolle hat spezifische Felder und Berechtigungen.
        </p>
        <div className="grid grid-cols-1 gap-4">

          <Link href="/dashboard/admin/users/new/folierer" passHref>
            <div className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <User className="h-6 w-6 mr-4 text-green-600" />
              <div>
                <h3 className="font-semibold">Folierer</h3>
                <p className="text-sm text-gray-500">Erstellt ein neues Folierer-Konto mit Adress- und Kontaktdaten.</p>
              </div>
            </div>
          </Link>
          <Link href="/dashboard/admin/users/new/haendler" passHref>
            <div className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <Store className="h-6 w-6 mr-4 text-purple-600" />
              <div>
                <h3 className="font-semibold">Händler</h3>
                <p className="text-sm text-gray-500">Erstellt ein neues Händler-Konto mit Firmen- und Adressdaten.</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
