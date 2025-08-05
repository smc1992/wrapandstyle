import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const { password } = await request.json();

  const correctPassword = process.env.WEBSITE_PASSWORD;

  // If no password is set in the environment, deny access.
  if (!correctPassword) {
    return new NextResponse('Password protection is not configured.', { status: 500 });
  }

  if (password === correctPassword) {
    const response = new NextResponse('Access granted.', { status: 200 });
    response.cookies.set('password_protected', 'true', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    return response;
  } else {
    return new NextResponse('Incorrect password.', { status: 401 });
  }
}
