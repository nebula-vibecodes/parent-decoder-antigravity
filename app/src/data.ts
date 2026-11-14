import { curatedTerms } from './termsCurated'
import { decodeSkipAliases, extraAliases, seeAlsoGroups } from './termAliases'

export type Concern = 'harmless' | 'discuss' | 'attention'
export type Category =
  | 'General slang'
  | 'Abbreviations'
  | 'Emojis & Symbols'
  | 'Gaming & Streaming'
  | 'Social Media Culture'
  | 'Relationships & Dating'
  | 'Substances & Party Culture'
  | 'Mental Well-being'
  | 'Sensitive Safety Topics'

export type Term = {
  term: string
  slug: string
  aliases: string[]
  plainMeaning: string
  summary: string
  interpretations: string[]
  example: string
  contextClues: string
  opener: string
  category: Category
  concern: Concern
  reviewed: string
  origin?: string
  /** Other library slugs for the same idea. Populated when guides overlap. */
  seeAlso?: string[]
}

export const terms: Term[] = curatedTerms.map((item) => ({
  ...item,
  aliases: [...item.aliases],
  interpretations: [...item.interpretations],
}))

/** Letters-and-numbers key used to compare names without case, punctuation, or emoji. */
export function aliasKey(value: string) {
  return value.toLowerCase().replace(/[\u2019']/g, '').replace(/[^a-z0-9]+/g, ' ').trim()
}

/** Exact-match key. Symbol-mixed scraps like "no 🧢" are not treated as the word "no". */
function exactKeys(value: string) {
  const key = aliasKey(value)
  if (!key) return []
  if (/[^\p{L}\p{N}\s'\u2019-]/u.test(value) && key.length < 4) return []
  return [key]
}

const seenAliasKeys = (item: Term) => new Set([aliasKey(item.term), ...item.aliases.map(aliasKey)].filter(Boolean))

/** Aliases actually added on top of what each term already listed. */
export const addedAliases: Record<string, string[]> = {}

for (const item of terms) {
  const extras = extraAliases[item.slug]
  if (!extras?.length) continue
  const seen = seenAliasKeys(item)
  for (const alias of extras) {
    const key = aliasKey(alias)
    if (!key || seen.has(key)) continue
    seen.add(key)
    item.aliases.push(alias)
    ;(addedAliases[item.slug] ??= []).push(alias)
  }
}

const seeAlsoBySlug = new Map<string, string[]>()
for (const group of seeAlsoGroups) {
  for (const slug of group) {
    const rest = group.filter((other) => other !== slug)
    seeAlsoBySlug.set(slug, [...new Set([...(seeAlsoBySlug.get(slug) ?? []), ...rest])])
  }
}
const slugs = new Set(terms.map((item) => item.slug))
for (const item of terms) {
  const refs = (seeAlsoBySlug.get(item.slug) ?? []).filter((slug) => slugs.has(slug))
  if (refs.length) item.seeAlso = refs
}

export const categories: Array<'All terms' | Category> = [
  'All terms',
  'General slang',
  'Abbreviations',
  'Emojis & Symbols',
  'Gaming & Streaming',
  'Social Media Culture',
  'Relationships & Dating',
  'Substances & Party Culture',
  'Mental Well-being',
  'Sensitive Safety Topics',
]

export const concernLabel: Record<Concern, string> = {
  harmless: 'Usually harmless',
  discuss: 'Worth discussing',
  attention: 'May need attention',
}

export const findTerm = (slug?: string) => terms.find((item) => item.slug === slug)

function isSymbolOnly(value: string) {
  return /[^a-z0-9\s]/i.test(value) && !/[a-z0-9]/i.test(value)
}

/** Names to show. Skips the head term itself and emoji-only duplicates of the title. */
export function alsoCalled(item: Term) {
  const head = aliasKey(item.term)
  const seen = new Set<string>()
  const names: string[] = []
  for (const alias of item.aliases) {
    if (isSymbolOnly(alias)) continue
    const key = aliasKey(alias)
    if (!key || key === head || seen.has(key)) continue
    seen.add(key)
    names.push(alias)
  }
  return names
}

export function aliasPreview(item: Term, limit = 3) {
  return [...alsoCalled(item)].sort((a, b) => aliasKey(a).length - aliasKey(b).length || a.localeCompare(b)).slice(0, limit)
}

export function seeAlsoTerms(item: Term) {
  return (item.seeAlso ?? []).map((slug) => findTerm(slug)).filter((term): term is Term => Boolean(term))
}

/** Alias the query names exactly, when that alias is not the head term. */
export function matchedAlias(item: Term, query: string) {
  const q = aliasKey(query)
  if (!q) return null
  if (exactKeys(item.term).includes(q)) return null
  return item.aliases.find((alias) => exactKeys(alias).includes(q)) ?? null
}

export function searchTerms(query: string) {
  const raw = query.trim().toLowerCase()
  if (!raw) return terms
  const q = aliasKey(query)
  const ranked: Array<{ item: Term; index: number; rank: number }> = []
  terms.forEach((item, index) => {
    const labels = [item.term, ...item.aliases]
    const keys = labels.flatMap(exactKeys)
    const exact = Boolean(q) && keys.some((label) => label === q)
    let hit = exact
    if (!hit && q.length >= 4 && keys.some((label) => label.includes(q))) hit = true
    if (!hit && q.length >= 3) {
      const hay = labels.concat([item.plainMeaning, item.summary, item.category]).join(' ')
      const word = new RegExp(`(^|[^a-z0-9])${escapeRegExp(q)}([^a-z0-9]|$)`, 'i')
      if (word.test(hay)) hit = true
    }
    if (!hit) return
    const rank = exact ? 0 : q && keys.some((label) => label.startsWith(q)) ? 1 : 2
    ranked.push({ item, index, rank })
  })
  ranked.sort((a, b) => a.rank - b.rank || a.index - b.index)
  return ranked.map(({ item }) => item)
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function patternHits(text: string, alias: string) {
  const a = alias.toLowerCase()
  if (!a) return false
  if (/[^a-z0-9\s]/i.test(a) && !/[a-z0-9]/i.test(a)) return text.includes(a)
  return new RegExp(`(^|[^a-z0-9])${escapeRegExp(a)}([^a-z0-9]|$)`, 'i').test(text)
}

/**
 * Whole-message decode uses aliases, except single letters and ordinary words
 * that would false-positive. The head term still matches, so existing short
 * guides such as pen, gas, green, and ed are unchanged.
 */
export function aliasUsedForDecode(alias: string) {
  if (!alias.trim()) return false
  if (isSymbolOnly(alias)) return true
  const key = aliasKey(alias)
  if (!key) return false
  if (decodeSkipAliases.has(key)) return false
  const tokens = key.split(' ')
  if (tokens.length === 1 && tokens[0].length <= 1) return false
  return true
}

export function decodeMessage(message: string) {
  const text = message.toLowerCase()
  const indexOf = (item: Term) => {
    const labels = [item.term, ...item.aliases.filter((alias) => aliasUsedForDecode(alias))]
    let best = Number.POSITIVE_INFINITY
    for (const label of labels) {
      const at = text.indexOf(label.toLowerCase())
      if (at >= 0 && at < best) best = at
    }
    return best
  }
  return terms
    .filter((item) => patternHits(text, item.term) || item.aliases.some((alias) => aliasUsedForDecode(alias) && patternHits(text, alias)))
    .sort((a, b) => indexOf(a) - indexOf(b))
}

/** The alias a pasted message actually used, when the head term itself is absent. */
export function heardAs(item: Term, message: string) {
  const text = message.toLowerCase()
  if (patternHits(text, item.term)) return null
  const hits = item.aliases.filter((alias) => aliasUsedForDecode(alias) && patternHits(text, alias))
  if (!hits.length) return null
  return [...hits].sort((a, b) => b.length - a.length)[0]
}
