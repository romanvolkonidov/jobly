//app/head.tsx
//this file works in the following way: it contains the head tags for the app

import { FontOptimizer } from '@/src/components/common/Performance';

export default function Head() {
  return (
    <>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

  <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <meta
        name="description"
        content="Get tasks done with skilled professionals"
      />
      <FontOptimizer />
    </>
  );
}
