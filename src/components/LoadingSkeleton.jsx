export default function LoadingSkeleton() {
  const shimmer = {
    background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0) 100%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 2s ease-in-out infinite',
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main card skeleton */}
        <div className="lg:col-span-8">
          <div className="glass-panel rounded-3xl p-8" style={shimmer}>
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="h-4 w-24 rounded-lg mb-3" style={{ background: 'rgba(255,255,255,0.06)' }}></div>
                <div className="h-6 w-48 rounded-lg" style={{ background: 'rgba(255,255,255,0.06)' }}></div>
              </div>
              <div className="h-20 w-20 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}></div>
            </div>
            <div className="h-24 w-56 rounded-xl mb-8" style={{ background: 'rgba(255,255,255,0.06)' }}></div>
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-16 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}></div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar skeletons */}
        <div className="lg:col-span-4 space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-panel rounded-3xl p-6" style={shimmer}>
              <div className="h-4 w-28 rounded-lg mb-4" style={{ background: 'rgba(255,255,255,0.06)' }}></div>
              <div className="space-y-3">
                <div className="h-8 w-full rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }}></div>
                <div className="h-8 w-3/4 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hourly skeleton */}
      <div className="glass-panel rounded-3xl p-6" style={shimmer}>
        <div className="h-4 w-32 rounded-lg mb-4" style={{ background: 'rgba(255,255,255,0.06)' }}></div>
        <div className="flex gap-3 overflow-hidden">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="shrink-0 h-28 w-24 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}></div>
          ))}
        </div>
      </div>
    </div>
  )
}
