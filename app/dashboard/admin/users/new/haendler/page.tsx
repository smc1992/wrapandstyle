import { CreateHaendlerForm } from '../../create-haendler-form';

export default function NewHaendlerPage() {
  return (
    <div className="w-full max-w-2xl mx-auto py-8">
      <div className="flex w-full items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Neuen Händler anlegen</h1>
      </div>
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-md border border-gray-200">
        <CreateHaendlerForm />
      </div>
    </div>
  );
}
