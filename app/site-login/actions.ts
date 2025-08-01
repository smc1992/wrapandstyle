'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export async function verifyPassword(formData: FormData) {
  const password = formData.get('password');
  const nextUrl = formData.get('next')?.toString() || '/';
  const sitePassword = process.env.SITE_PASSWORD;

  if (password === sitePassword && sitePassword) {
    const cookieStore = cookies();
    cookieStore.set('site-access-granted', 'true', {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
    redirect(nextUrl);
  } else {
    const loginUrl = new URL('/site-login', 'http://dummy-base.com');
    loginUrl.searchParams.set('error', 'invalid_password');
    if (nextUrl) {
      loginUrl.searchParams.set('next', nextUrl);
    }
    redirect(loginUrl.pathname + loginUrl.search);
  }
}
