// Forbes scraper — server-side only, never imported from client code

export interface ForbesBillionaire {
  rank: number
  name: string
  netWorth: number // USD
  imageUrl: string | null
}

const FORBES_API_URL =
  'https://www.forbes.com/forbesapi/person/rtb/0/position/true.json'

type RawPerson = Record<string, unknown>

function parsePerson(p: RawPerson, i: number): ForbesBillionaire {
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

function buildFetchUrl(): string {
  const scraperKey = process.env.SCRAPER_API_KEY
  if (scraperKey) {
    return `https://api.scraperapi.com?api_key=${scraperKey}&url=${encodeURIComponent(FORBES_API_URL)}`
  }
  return FORBES_API_URL
}

export async function fetchForbesBillionaires(): Promise<ForbesBillionaire[]> {
  const url = buildFetchUrl()
  const usingProxy = url !== FORBES_API_URL

  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
      Accept: 'application/json, */*',
      'Accept-Language': 'en-US,en;q=0.9',
      ...(usingProxy ? {} : {
        Referer: 'https://www.forbes.com/real-time-billionaires/',
        Origin: 'https://www.forbes.com',
      }),
    },
    next: { revalidate: 0 },
  })

  if (!res.ok) {
    throw new Error(`Forbes API responded with ${res.status} ${res.statusText}`)
  }

  const data = await res.json() as Record<string, unknown>
  const personList = data['personList'] as Record<string, unknown> | null
  const persons = (personList?.['personsLists'] ?? []) as RawPerson[]

  if (!persons.length) {
    throw new Error(
      `Forbes API returned no persons. Keys in response: ${Object.keys(data).join(', ')}`
    )
  }

  return persons
    .map(parsePerson)
    .filter(p => p.name && p.netWorth > 0)
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 10)
}
