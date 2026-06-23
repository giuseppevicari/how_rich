// Forbes scraper — server-side only, never imported from client code

export interface ForbesBillionaire {
  rank: number
  name: string
  netWorth: number // USD
  imageUrl: string | null
}

const FORBES_URL = 'https://www.forbes.com/billionaires/'

const PERSON_LIST_RE = /"personList"\s*:\s*\{[^}]*"personsLists"\s*:\s*(\[[\s\S]*?\])\s*\}/

export async function fetchForbesBillionaires(): Promise<ForbesBillionaire[]> {
  const res = await fetch(FORBES_URL, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (compatible; HowRich/1.0; +https://howrich.app)',
      Accept: 'text/html,application/xhtml+xml',
    },
    next: { revalidate: 0 },
  })

  if (!res.ok) {
    throw new Error(`Forbes fetch failed: ${res.status} ${res.statusText}`)
  }

  const html = await res.text()

  const match = html.match(PERSON_LIST_RE)
  if (!match) {
    throw new Error('Could not locate billionaire data in Forbes page')
  }

  let persons: Record<string, unknown>[]
  try {
    persons = JSON.parse(match[1])
  } catch {
    throw new Error('Failed to parse Forbes billionaire JSON')
  }

  return persons
    .slice(0, 10)
    .map((p, i) => ({
      rank: (p['rank'] as number | null) ?? i + 1,
      name: String(p['personName'] ?? p['name'] ?? ''),
      netWorth: ((p['finalWorth'] as number | null) ?? 0) * 1_000_000,
      imageUrl: (p['squareImage'] as string | null) ?? null,
    }))
    .filter(p => p.name && p.netWorth > 0)
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 10)
}
