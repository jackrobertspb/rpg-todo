/**
 * Global error handler utility
 * Catches errors and prevents white screen of death
 */

// Catch unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  
  // Prevent white screen
  event.preventDefault();
  
  // Show user-friendly message if offline
  if (!navigator.onLine) {
    console.warn('User is offline. Suppressing error to prevent white screen.');
  }
});

// Catch general errors
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  
  // Prevent white screen for module loading errors when offline
  if (!navigator.onLine && event.message?.includes('module')) {
    console.warn('Module loading failed while offline. Suppressing error.');
    event.preventDefault();
  }
});

export function handleApiError(error, defaultMessage = 'An error occurred') {
  if (!error.response && !navigator.onLine) {
    return 'You are currently offline. Please check your internet connection.';
  }
  
  return error.response?.data?.error || error.message || defaultMessage;
}

