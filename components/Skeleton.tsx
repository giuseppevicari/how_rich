'use client'

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-zinc-800 rounded-xl ${className}`} />
  )
}

export function BillionaireSelectorSkeleton() {
  return (
    <section>
      <div className="h-4 w-36 bg-zinc-800 rounded animate-pulse mb-4" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2 p-3 rounded-xl border border-zinc-800 bg-zinc-800/40 animate-pulse">
            <div className="w-14 h-14 rounded-full bg-zinc-700 mt-3" />
            <div className="w-16 h-3 bg-zinc-700 rounded" />
            <div className="w-10 h-3 bg-zinc-700 rounded" />
          </div>
        ))}
      </div>
    </section>
  )
}

export function ResultsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between p-4 bg-zinc-800/40 rounded-xl border border-zinc-800 animate-pulse">
          <div className="space-y-2">
            <div className="h-4 w-32 bg-zinc-700 rounded" />
            <div className="h-3 w-20 bg-zinc-700 rounded" />
          </div>
          <div className="h-8 w-20 bg-zinc-700 rounded" />
        </div>
      ))}
    </div>
  )
}
