// src/styles/auth.styles.ts

export const authStyles = {
  container: 'min-h-screen flex items-center justify-center bg-gray-50 p-md',
  wrapper: 'w-full max-w-md shadow-lg',
  formContainer: 'p-xxl space-y-lg',
  title: 'text-h2 font-bold text-gray-900 text-center mb-sm',
  description: 'text-small text-gray-600 text-center mb-lg',
  form: 'space-y-lg',
  label: 'block text-small font-medium text-gray-600 mb-xs',
  input: 'w-full px-md py-sm border border-gray-300 rounded-md shadow-sm' +
         ' placeholder-gray-600 focus:outline-none focus:ring-2' +
         ' focus:ring-primary-blue focus:border-primary-blue' +
         ' transition-all duration-default',
  button: 'w-full flex justify-center py-sm px-md border-0' +
         ' rounded-md shadow-sm text-small font-medium text-white' + // this should work now
         ' bg-primary-blue hover:bg-primary-blue/90 focus:outline-none' +
         ' focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue' +
         ' disabled:opacity-50 disabled:cursor-not-allowed' +
         ' transition-all duration-default',
  link: 'text-small text-primary-blue hover:text-primary-blue/80' +
        ' transition-all duration-default',
  message: (type: 'error' | 'success') =>
    `p-md rounded-md text-small ${
      type === 'error'
        ? 'bg-status-error/10 text-status-error'
        : 'bg-status-success/10 text-status-success'
    }`
};