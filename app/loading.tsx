// app/loading.tsx
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="space-y-8 w-full max-w-2xl px-4">
        {/* Header skeleton */}
        <div className="flex flex-col items-center">
          <div className="w-48 h-8 bg-gray-200 animate-pulse rounded-md mb-6" />
        </div>

        {/* Main content skeleton */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-full h-16 bg-gray-200 animate-pulse rounded-lg"
            />
          ))}
        </div>

        {/* Secondary content skeleton */}
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="w-full h-12 bg-gray-200 animate-pulse rounded-md"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
