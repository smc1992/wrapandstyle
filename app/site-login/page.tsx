import { Suspense } from 'react';
import LoginForm from './login-form';

// A simple loading skeleton
const Loading = () => (
  <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-sm animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-full mx-auto mb-6"></div>
    <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
    <div className="h-10 bg-gray-300 rounded w-full"></div>
  </div>
);

export default function SiteLoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Suspense fallback={<Loading />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
