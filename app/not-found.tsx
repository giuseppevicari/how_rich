import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-7xl font-black text-amber-400 mb-4">404</p>
        <h1 className="text-2xl font-bold text-white mb-2">Billionaire not found</h1>
        <p className="text-zinc-400 mb-8">They may have dropped off the top 10, or the slug is wrong.</p>
        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-xl bg-amber-400 text-black font-semibold text-sm hover:bg-amber-300 transition-colors"
        >
          Back to rankings
        </Link>
      </div>
    </main>
  )
}
