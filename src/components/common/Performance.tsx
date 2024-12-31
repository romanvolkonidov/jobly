import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import { Suspense, lazy, ComponentType } from 'react';

// Lazy load components by default
export const withLazyLoading = <P extends object>(Component: React.ComponentType<P>) => {
  return function LazyComponent(props: P) {
    const { ref, inView } = useInView({
      triggerOnce: true,
      threshold: 0.1,
    });

    return <div ref={ref}>{inView && <Component {...props} />}</div>;
  };
};

// Optimized Image wrapper using Next.js Image
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`${className} w-auto h-auto`}
      priority={false}
      loading="lazy"
    />
  );
}

// Font optimization wrapper
export function FontOptimizer() {
  return null; // Removed custom font loading from here
}

// Dynamic imports optimizer
export function withDynamicImport<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  LoadingComponent: React.ComponentType = () => <div>Loading...</div>
) {
  const LazyComponent = lazy(importFn);
  return function DynamicComponent(props: P) {
    return (
      <Suspense fallback={<LoadingComponent />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}