import React from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Hier könnte ein spezifisches Admin-Layout mit eigener Navigation etc. hin
  return (
    <div className="p-6">
      {children}
    </div>
  );
}
