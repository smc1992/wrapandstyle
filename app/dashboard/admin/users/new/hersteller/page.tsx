import { CreateHerstellerForm } from '@/components/admin/create-hersteller-form';

export default function NewHerstellerPage() {
  return (
    <div className="w-full max-w-2xl mx-auto py-8">
      <div className="flex w-full items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Neuen Hersteller anlegen</h1>
      </div>
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-md border border-gray-200">
        <CreateHerstellerForm />
      </div>
    </div>
  );
}
