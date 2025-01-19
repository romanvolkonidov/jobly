import { SWRConfiguration } from 'swr';

export const swrConfig: SWRConfiguration = {
  revalidateOnFocus: false, // Don't revalidate on window focus
  revalidateIfStale: false, // Don't revalidate if data is stale
  dedupingInterval: 5000, // Dedupe similar requests within 5 seconds
  errorRetryCount: 3, // Retry failed requests 3 times
  focusThrottleInterval: 5000, // Throttle focus events to 5 seconds
  loadingTimeout: 3000, // Show loading state after 3 seconds
  suspense: true, // Enable React Suspense mode
};
