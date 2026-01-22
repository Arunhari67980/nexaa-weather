export default function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Current Weather Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-linear-to-r from-slate-800/50 to-slate-700/50 rounded-2xl p-6 animate-shimmer">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="h-8 w-32 bg-slate-600/50 rounded mb-2 animate-pulse"></div>
                <div className="h-4 w-48 bg-slate-600/50 rounded animate-pulse"></div>
              </div>
              <div className="h-20 w-20 bg-slate-600/50 rounded-full animate-pulse"></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-slate-600/50 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-linear-to-r from-slate-800/50 to-slate-700/50 rounded-2xl p-4 h-24 animate-shimmer animate-pulse"
            ></div>
          ))}
        </div>
      </div>

      {/* Hourly Forecast Skeleton */}
      <div className="bg-linear-to-r from-slate-800/50 to-slate-700/50 rounded-2xl p-6 animate-shimmer">
        <div className="h-6 w-32 bg-slate-600/50 rounded mb-4 animate-pulse"></div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="shrink-0">
              <div className="h-28 w-20 bg-slate-600/50 rounded-lg animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Forecast Skeleton */}
      <div className="bg-linear-to-r from-slate-800/50 to-slate-700/50 rounded-2xl p-6 animate-shimmer">
        <div className="h-6 w-32 bg-slate-600/50 rounded mb-4 animate-pulse"></div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-slate-600/50 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  )
}
