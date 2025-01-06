'use client';

import { FC } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  onSignup: () => void;
}

const AuthModal: FC<AuthModalProps> = ({ isOpen, onClose, onLogin, onSignup }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-50 bg-white p-6 rounded-lg shadow-xl max-w-md w-full m-4">
        <h2 className="text-xl font-semibold mb-4">Authentication Required</h2>
        <p className="text-gray-600 mb-6">
        Post your task - sign up free
        </p>
        <div className="flex gap-4">
          <button
            onClick={onLogin}
            className="flex-1 px-4 py-2 border rounded hover:bg-gray-50 transition-colors"
          >
            Log In
          </button>
          <button
            onClick={onSignup}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;