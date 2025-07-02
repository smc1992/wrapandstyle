export default function AuthError() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
       <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-red-600">Fehler bei der Authentifizierung</h1>
        <p className="text-gray-700">Leider ist bei der Anmeldung ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie den Support.</p>
      </div>
    </div>
  )
}
