import { BillionaireSelectorSkeleton } from '@/components/Skeleton'

export default function Loading() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-black tracking-tight mb-3">
            How <span className="text-amber-400">Rich?</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Translate billionaire wealth into things you can actually imagine.
          </p>
        </header>
        <BillionaireSelectorSkeleton />
      </div>
    </main>
  )
}
