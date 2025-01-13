export const tokens = {
  colors: {
    primary: {
      light: '#EEF2FF',   // indigo-50
      main: '#2563EB',    // blue-600
      dark: '#1D4ED8',    // blue-700
      accent: '#4F46E5'   // indigo-600
    },
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      300: '#D1D5DB',
      600: '#4B5563',
      900: '#111827'
    },
    success: '#16A34A',
    white: '#FFFFFF'
  },
  typography: {
    fontFamily: {
      primary: 'Inter, sans-serif'
    },
    fontSize: {
      display: '36px',
      h1: '30px',
      h2: '24px',
      h3: '20px',
      body: '16px',
      small: '14px'
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75
    }
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px'
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    full: '9999px'
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)'
  },
  transitions: {
    default: '200ms ease-in-out'
  }
}

export default tokens;