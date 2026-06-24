// Forbes scraper — server-side only, never imported from client code

export interface ForbesBillionaire {
  rank: number
  name: string
  netWorth: number // USD
  imageUrl: string | null
}

// Try RTB (real-time) first, fall back to annual list
const FORBES_RTB_URL =
  'https://www.forbes.com/forbesapi/person/rtb/0/position/true.json?fields=rank,personName,squareImage,realTimeWorth,finalWorth,naturalId&limit=20'

const FORBES_ANNUAL_URL =
  'https://www.forbes.com/forbesapi/person/billionaires/0/position/true.json?fields=rank,personName,squareImage,finalWorth,naturalId&limit=20'

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

function proxyUrl(target: string): string {
  const key = process.env.SCRAPER_API_KEY
  if (!key) return target
  // country_code=us ensures a US residential IP (Forbes is US-focused)
  return `https://api.scraperapi.com?api_key=${key}&country_code=us&url=${encodeURIComponent(target)}`
}

async function fetchPersons(targetUrl: string): Promise<RawPerson[]> {
  const url = proxyUrl(targetUrl)

  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
      Accept: 'application/json, */*',
      'Accept-Language': 'en-US,en;q=0.9',
      Referer: 'https://www.forbes.com/real-time-billionaires/',
    },
    next: { revalidate: 0 },
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(
      `Forbes API ${res.status} ${res.statusText}${body ? `: ${body.slice(0, 200)}` : ''}`
    )
  }

  const data = await res.json() as Record<string, unknown>
  const personList = data['personList'] as Record<string, unknown> | null
  const persons = (personList?.['personsLists'] ?? []) as RawPerson[]

  if (!persons.length) {
    throw new Error(
      `Forbes API returned no persons. Top-level keys: ${Object.keys(data).join(', ')}`
    )
  }

  return persons
}

export async function fetchForbesBillionaires(): Promise<ForbesBillionaire[]> {
  let persons: RawPerson[]

  try {
    persons = await fetchPersons(FORBES_RTB_URL)
  } catch (rtbErr) {
    // Real-time list failed — try the annual billionaires list
    try {
      persons = await fetchPersons(FORBES_ANNUAL_URL)
    } catch (annualErr) {
      throw new Error(
        `Both Forbes endpoints failed.\nRTB: ${rtbErr}\nAnnual: ${annualErr}`
      )
    }
  }

  return persons
    .map(parsePerson)
    .filter(p => p.name && p.netWorth > 0)
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 10)
}
