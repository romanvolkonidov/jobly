import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { LogOut, Settings, User } from 'lucide-react';

interface Props {
  imageUrl: string;  // other props remain same
}



export function UserMenu({
  isUserMenuOpen,
  setIsUserMenuOpenAction,
  onLogoutAction,
  imageUrl
}: Props) {
  const { data: session } = useSession();
  const isAuthenticated = !!session;

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      onLogoutAction();
      setIsUserMenuOpenAction(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="relative">
      {isAuthenticated ? (
        <button 
          onClick={() => setIsUserMenuOpenAction(!isUserMenuOpen)}
          className="flex items-center space-x-2"
        >
<Image
src={imageUrl}
alt="Profile"
width={40}
height={40}
className="rounded-full"
priority
/>
        </button>
      ) : (
        <div className="flex space-x-2">
          <Link href="/auth/signup" className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
            Sign Up
          </Link>
          <Link href="/auth/login" className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
            Login
          </Link>
        </div>
      )}

      {isUserMenuOpen && isAuthenticated && (
        <div className="absolute right-0 mt-2 w-48 py-2 z-50 bg-white rounded-lg shadow-lg border border-gray-100">
          <Link href="/profile" onClick={() => setIsUserMenuOpenAction(false)} className="flex px-4 py-2 hover:bg-gray-50 items-center text-gray-700">
            <User className="h-4 w-4 mr-2" /> Profile
          </Link>
          <Link href="/settings" onClick={() => setIsUserMenuOpenAction(false)} className="flex px-4 py-2 hover:bg-gray-50 items-center text-gray-700">
            <Settings className="h-4 w-4 mr-2" /> Settings
          </Link>
          <button onClick={handleLogout} className="flex w-full px-4 py-2 hover:bg-gray-50 items-center text-red-600">
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </button>
        </div>
      )}
    </div>
  );
}