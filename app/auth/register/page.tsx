// app/auth/register/page.tsx
//this file works in the following way: it renders the register form
'use client';

import AuthForm from '@/src/components/auth/AuthForm';

export default function RegisterPage() {
  return <AuthForm defaultView="register" />;
}
