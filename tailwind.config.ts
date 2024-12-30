module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          blue: '#2563EB',
          orange: '#F97316',
        },
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          300: '#D1D5DB',
          600: '#4B5563',
          900: '#111827',
        },
        status: {
          success: '#22C55E',
          error: '#EF4444',
          warning: '#F59E0B',
        },
        white: '#FFFFFF',
        black: '#000000',
        transparent: 'transparent',
      },
      fontSize: {
        display: ['36px', { lineHeight: '1.2' }],
        h1: ['30px', { lineHeight: '1.2' }],
        h2: ['24px', { lineHeight: '1.2' }],
        h3: ['20px', { lineHeight: '1.2' }],
        body: ['16px', { lineHeight: '1.5' }],
        small: ['14px', { lineHeight: '1.5' }],
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        xxl: '48px',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        full: '9999px',
      },
      fontFamily: {
        primary: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
      },
      transitionDuration: {
        default: '200ms',
        slow: '300ms',
        fast: '100ms',
      },
    },
  },
};
