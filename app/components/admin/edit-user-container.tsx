"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { EditUserForm } from '@/components/admin/edit-user-form';
import { type Profile } from '@/lib/types';

interface ProfileWithEmail extends Profile {
  email: string;
}

export function EditUserContainer({ userId }: { userId: string }) {
  const [profile, setProfile] = useState<ProfileWithEmail | null>(null);
  const [roleData, setRoleData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;

      const supabase = createClient();
      setLoading(true);

      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError || !profileData) {
        setError('Benutzerprofil nicht gefunden.');
        setLoading(false);
        return;
      }

      // Fetch role-specific data
      if (['folierer', 'haendler', 'hersteller'].includes(profileData.role)) {
        const { data: specificData, error: roleError } = await supabase
          .from(profileData.role)
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();
        
        if (roleError) {
          console.error(`Fehler beim Abrufen der ${profileData.role}-Daten:`, roleError);
          // Continue without role data, but log the error
        }
        setRoleData(specificData);
      }
      
      setProfile(profileData as ProfileWithEmail);
      setLoading(false);
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return <div>Lade Benutzerdaten...</div>;
  }

  if (error) {
    return <div>Fehler: {error}</div>;
  }

  if (!profile) {
    return <div>Benutzer nicht gefunden.</div>;
  }

  return (
    <div className="flex flex-col w-full">
      <header className="flex items-center p-4 border-b bg-muted/40">
        <h1 className="text-xl font-semibold">Benutzer bearbeiten: {profile.email}</h1>
      </header>
      <main className="p-4">
        <div className="max-w-2xl mx-auto">
          <EditUserForm profile={profile} roleData={roleData} />
        </div>
      </main>
    </div>
  );
}
