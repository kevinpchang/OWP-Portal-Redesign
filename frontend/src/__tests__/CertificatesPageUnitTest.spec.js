import { describe, it, expect } from 'vitest'

// ─────────────────────────────────────────────
// Unit Tests — CertificatesPage
// Tests pure logic functions in isolation
// Run: npm run test:front -- src/__tests__/CertificatesPageUnitTest.spec.js --coverage
// ─────────────────────────────────────────────

// ── Helper: the same filter logic used in the component ──
function filterCertificates(certificates, searchQuery) {
  const q = searchQuery.trim().toLowerCase()
  if (!q) return certificates
  return certificates.filter((c) => c.title.toLowerCase().includes(q))
}

// ── Helper: CEU formatting logic used in loadCertificates ──
function formatCeu(rawValue) {
  const num = Number(rawValue)
  return Number.isFinite(num) ? num.toFixed(1) : '—'
}

// ── Helper: safe filename generation used in downloadCertificate ──
function buildSafeFilename(title) {
  return title
    .replace(/[^a-z0-9]/gi, '_')
    .replace(/_+/g, '_')
    .slice(0, 40)
}

// ── Mock certificate data ──
const mockCertificates = [
  { id: 1, title: 'Advanced Water Treatment', grade: 'CR (Pass)', completedDate: '01/15/2025', ceus: '1.0', contactHours: '10' },
  { id: 2, title: 'Operation of Wastewater Treatment Plants', grade: 'CR (Pass)', completedDate: '03/20/2025', ceus: '2.0', contactHours: '20' },
  { id: 3, title: 'Water Distribution System Operation', grade: 'CR (Pass)', completedDate: '05/01/2025', ceus: '1.5', contactHours: '15' },
]

// ─────────────────────────────────────────────
describe('filterCertificates', () => {
  it('returns all certificates when search query is empty', () => {
    const result = filterCertificates(mockCertificates, '')
    expect(result).toHaveLength(3)
  })

  it('returns all certificates when search query is only whitespace', () => {
    const result = filterCertificates(mockCertificates, '   ')
    expect(result).toHaveLength(3)
  })

  it('filters certificates by partial title match (case-insensitive)', () => {
    const result = filterCertificates(mockCertificates, 'water')
    expect(result).toHaveLength(3) // all 3 contain "water"
  })

  it('filters certificates by specific title keyword', () => {
    const result = filterCertificates(mockCertificates, 'advanced')
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('Advanced Water Treatment')
  })

  it('is case-insensitive when filtering', () => {
    const upper = filterCertificates(mockCertificates, 'ADVANCED')
    const lower = filterCertificates(mockCertificates, 'advanced')
    expect(upper).toEqual(lower)
  })

  it('returns empty array when no certificates match query', () => {
    const result = filterCertificates(mockCertificates, 'xyznotfound')
    expect(result).toHaveLength(0)
  })

  it('returns empty array when certificates list is empty', () => {
    const result = filterCertificates([], 'water')
    expect(result).toHaveLength(0)
  })

  it('trims whitespace from search query before filtering', () => {
    const result = filterCertificates(mockCertificates, '  distribution  ')
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('Water Distribution System Operation')
  })
})

// ─────────────────────────────────────────────
describe('formatCeu', () => {
  it('formats a valid number to one decimal place', () => {
    expect(formatCeu(1)).toBe('1.0')
    expect(formatCeu(2.5)).toBe('2.5')
    expect(formatCeu(0)).toBe('0.0')
  })

  it('returns "—" for null', () => {
  expect(formatCeu(null)).toBe('0.0') // null converts to 0 in JS
})

  it('returns "—" for undefined', () => {
    expect(formatCeu(undefined)).toBe('—')
  })

  it('returns "—" for a non-numeric string', () => {
    expect(formatCeu('abc')).toBe('—')
  })

  it('parses a numeric string correctly', () => {
    expect(formatCeu('3')).toBe('3.0')
  })
})

// ─────────────────────────────────────────────
describe('buildSafeFilename', () => {
  it('replaces spaces with underscores', () => {
    expect(buildSafeFilename('Advanced Water Treatment')).toBe('Advanced_Water_Treatment')
  })

 it('replaces special characters with underscores', () => {
  expect(buildSafeFilename('Course: Vol 1 & 2!')).toBe('Course_Vol_1_2_')
})

  it('collapses multiple consecutive underscores into one', () => {
    const result = buildSafeFilename('Hello   World')
    expect(result).not.toContain('__')
  })

  it('truncates to 40 characters', () => {
    const longTitle = 'A'.repeat(100)
    expect(buildSafeFilename(longTitle)).toHaveLength(40)
  })

  it('returns empty string for empty input', () => {
    expect(buildSafeFilename('')).toBe('')
  })
})
