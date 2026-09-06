import { afterEach, describe, expect, it, vi } from 'vitest'
import { requestOrigin, siteUrl } from './site-url'

const headers = (h: Record<string, string>) => ({
  get: (name: string) => h[name.toLowerCase()] ?? null,
})

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('the origin our mailed links point at', () => {
  it('follows the request off production, so a preview links to itself', () => {
    vi.stubEnv('VERCEL_ENV', 'preview')
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://www.fieldy.ca')
    expect(
      requestOrigin(
        headers({
          'x-forwarded-proto': 'https',
          'x-forwarded-host': 'fieldy-git-branch.vercel.app',
        }),
      ),
    ).toBe('https://fieldy-git-branch.vercel.app')
  })

  /* The bug this exists for: production also answers on the vercel domain and
     on the apex, and a login started at either used to mail a link back there. */
  it('pins the canonical site on production, whatever host was asked for', () => {
    vi.stubEnv('VERCEL_ENV', 'production')
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://www.fieldy.ca/')
    expect(
      requestOrigin(
        headers({
          'x-forwarded-proto': 'https',
          'x-forwarded-host': 'fieldy-three.vercel.app',
        }),
      ),
    ).toBe('https://www.fieldy.ca')
  })

  it('falls back to localhost when nothing is configured', () => {
    vi.stubEnv('VERCEL_ENV', '')
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '')
    expect(requestOrigin(headers({}))).toBe('http://localhost:3000')
    expect(siteUrl()).toBe('http://localhost:3000')
  })
})
