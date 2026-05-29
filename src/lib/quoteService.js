import { CARRIERS } from './carriers.js'

// Starting monthly price per coverage type (matches the mockup "From $X/mo").
const BASE_PRICE = { auto: 47, home: 89, business: 52, moto: 19 }

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Tiny deterministic PRNG so the same ZIP + coverage always yields the same
// quotes (feels stable while the user navigates back and forth).
function makeRng(seedStr) {
  let seed = 0
  for (let i = 0; i < seedStr.length; i++) seed = (seed * 31 + seedStr.charCodeAt(i)) >>> 0
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0
    return seed / 0xffffffff
  }
}

function buildMockQuotes({ coverageType = 'auto', zip = '00000' }) {
  const base = BASE_PRICE[coverageType] ?? 50
  const rng = makeRng(`${coverageType}:${zip}`)

  // Pick 6 carriers deterministically.
  const pool = [...CARRIERS]
  const picked = []
  while (picked.length < 6 && pool.length) {
    const idx = Math.floor(rng() * pool.length)
    picked.push(pool.splice(idx, 1)[0])
  }

  const quotes = picked.map((carrier) => {
    // Spread prices from ~0.95x to ~1.7x of base.
    const factor = 0.95 + rng() * 0.75
    const monthly = Math.round(base * factor)
    const rating = (4.2 + rng() * 0.8).toFixed(1)
    return {
      id: carrier.id,
      name: carrier.name,
      shape: carrier.shape,
      tone: carrier.tone,
      monthly,
      annual: monthly * 12,
      rating,
    }
  })

  quotes.sort((a, b) => a.monthly - b.monthly)
  const priciest = quotes[quotes.length - 1].annual
  return quotes.map((q, i) => ({
    ...q,
    best: i === 0,
    // Yearly savings versus the most expensive option in the set.
    savingsVsHighest: priciest - q.annual,
  }))
}

/**
 * Fetch comparison quotes for the marketplace.
 *
 * Today this returns deterministic sample data so the wizard feels complete
 * without a backend. The `payload` is already shaped the way the real rater
 * expects, so wiring up Turborater is a localized change here only.
 *
 * @param {{ coverageType: string, zip: string, details?: object, contact?: object }} payload
 * @returns {Promise<Array>} list of carrier quotes, cheapest first
 */
export async function getQuotes(payload) {
  // TODO: integrar Turborater
  // const res = await fetch(import.meta.env.VITE_TURBORATER_API_URL, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload),
  // })
  // if (!res.ok) throw new Error('Rater request failed')
  // return normalizeTurboraterResponse(await res.json())

  await delay(1800) // simulate the "shopping carriers" moment
  return buildMockQuotes(payload)
}
