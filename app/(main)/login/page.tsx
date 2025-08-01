'use client'

import AuthForm from '@/components/auth/auth-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSearchParams } from 'next/navigation';

const Message = ({ message, status }: { message: string; status: string | null }) => {
  const bgColor = status === 'success' ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900';
  const textColor = status === 'success' ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200';
  return (
    <div className={`p-4 mb-4 text-sm rounded-lg ${bgColor} ${textColor}`}>
      {message}
    </div>
  );
};

export default function LoginPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message');
  const status = searchParams.get('status');

  return (
    <main className="container mx-auto px-4 py-16 flex justify-center">
      <div className="w-full max-w-md">
        {message && <Message message={message} status={status} />}
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Anmelden</TabsTrigger>
            <TabsTrigger value="signup">Registrieren</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Willkommen zurück!</CardTitle>
              </CardHeader>
              <CardContent>
                <AuthForm action="login" />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Neues Konto erstellen</CardTitle>
              </CardHeader>
              <CardContent>
                <AuthForm action="signup" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
