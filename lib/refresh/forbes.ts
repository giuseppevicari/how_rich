// Forbes scraper — server-side only, never imported from client code

export interface ForbesBillionaire {
  rank: number
  name: string
  netWorth: number // USD
  imageUrl: string | null
}

const FORBES_API_URL =
  'https://www.forbes.com/forbesapi/person/rtb/0/position/true.json'

const PERSON_LIST_RE = /"personList"\s*:\s*\{[^}]*"personsLists"\s*:\s*(\[[\s\S]*?\])\s*\}/

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (compatible; HowRich/1.0; +https://howrich.app)',
  Accept: 'application/json, text/html',
}

function parsePerson(p: Record<string, unknown>, i: number): ForbesBillionaire {
  const rank =
    (p['rank'] as number | null) ??
    (p['realTimeRank'] as number | null) ??
    (p['position'] as number | null) ??
    i + 1
  const name = String(p['personName'] ?? p['name'] ?? '')
  const worthMillions =
    (p['realTimeWorth'] as number | null) ??
    (p['finalWorth'] as number | null) ??
    0
  const netWorth = worthMillions * 1_000_000
  const imageUrl =
    (p['squareImage'] as string | null) ??
    (p['image'] as string | null) ??
    null
  return { rank, name, netWorth, imageUrl }
}

type RawPerson = Record<string, unknown>

async function fetchFromApi(): Promise<RawPerson[]> {
  const res = await fetch(FORBES_API_URL, {
    headers: HEADERS,
    next: { revalidate: 0 },
  })

  if (!res.ok) throw new Error(`Forbes API fetch failed: ${res.status}`)

  const data = await res.json() as Record<string, unknown>
  const personList = data['personList'] as Record<string, unknown> | null
  const persons = (personList?.['personsLists'] ?? []) as RawPerson[]

  if (!persons.length) throw new Error('No persons in Forbes API response')
  return persons
}

async function fetchFromHtml(): Promise<RawPerson[]> {
  const res = await fetch('https://www.forbes.com/real-time-billionaires/', {
    headers: HEADERS,
    next: { revalidate: 0 },
  })

  if (!res.ok) throw new Error(`Forbes HTML fetch failed: ${res.status}`)

  const html = await res.text()
  const match = html.match(PERSON_LIST_RE)
  if (!match) throw new Error('Could not locate billionaire data in Forbes page')

  return JSON.parse(match[1]) as RawPerson[]
}

export async function fetchForbesBillionaires(): Promise<ForbesBillionaire[]> {
  let persons: RawPerson[]

  try {
    persons = await fetchFromApi()
  } catch {
    // Fall back to HTML scraping if the JSON API is blocked
    persons = await fetchFromHtml()
  }

  return persons
    .map(parsePerson)
    .filter(p => p.name && p.netWorth > 0)
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 10)
}
