import { useState } from 'react';
import { Card } from '../ui/Card';

const AuthForm = () => {
  const [formType, setFormType] = useState('register');
  const [role, setRole] = useState('client');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <div className="p-6 space-y-6">
          <h1 className="text-2xl font-semibold text-[#111827]">
            {formType === 'register' ? 'Create Account' : 'Welcome Back'}
          </h1>
          
          {formType === 'register' && (
            <div className="flex gap-4 p-1 bg-[#F3F4F6] rounded-md">
              <button
                onClick={() => setRole('client')}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all
                  ${role === 'client' ? 'bg-white text-[#2563EB] shadow-sm' : 'text-[#4B5563]'}`}
              >
                I need something done
              </button>
              <button
                onClick={() => setRole('worker')}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all
                  ${role === 'worker' ? 'bg-white text-[#2563EB] shadow-sm' : 'text-[#4B5563]'}`}
              >
                I want to work
              </button>
            </div>
          )}

          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#4B5563]">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                className="mt-1 w-full rounded-md border border-[#D1D5DB] px-3 py-2
                  focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#4B5563]">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="mt-1 w-full rounded-md border border-[#D1D5DB] px-3 py-2
                  focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#4B5563]">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Create a password"
                className="mt-1 w-full rounded-md border border-[#D1D5DB] px-3 py-2
                  focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#2563EB] text-white py-2 px-4 rounded-md
                font-medium hover:bg-[#1D4ED8] focus:outline-none focus:ring-2
                focus:ring-[#2563EB] focus:ring-offset-2"
            >
              {formType === 'register' ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-[#4B5563]">
            {formType === 'register' ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setFormType(formType === 'register' ? 'login' : 'register')}
              className="text-[#2563EB] font-medium hover:text-[#1D4ED8]"
            >
              {formType === 'register' ? 'Sign In' : 'Create One'}
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default AuthForm;