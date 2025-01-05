// components/LogoutButton.tsx
'use client';

import { signOut } from 'next-auth/react';



export default function LogoutButton() {
  const handleLogout = async () => {
    await signOut({
      redirect: true,
      callbackUrl: '/auth/login',
    });
  };

  return (
    <button
      onClick={handleLogout}
      className="text-red-600 hover:text-red-800 font-medium"
    >
      Log out
    </button>
  );
}
