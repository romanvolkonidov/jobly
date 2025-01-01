// app/auth/login/page.tsx
//this file works in the following way: it renders the login form
'use client';

import { memo } from 'react';
import AuthForm from '@/src/components/auth/AuthForm';

const LoginPage = memo(function LoginPage() {
  return <AuthForm defaultView="login" />;
});

export default LoginPage;