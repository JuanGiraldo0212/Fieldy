import { describe, expect, it } from 'vitest'
import { checkUploads, fileSize, MAX_UPLOAD_BYTES } from './uploads'

const f = (name: string, size = 1000, type = 'application/pdf') => ({ name, size, type })

describe('checkUploads', () => {
  it('accepts a few ordinary files', () => {
    expect(checkUploads([f('form.pdf'), f('group.jpg', 44_209, 'image/jpeg')])).toEqual({ ok: true })
  })

  it('accepts nothing at all', () => {
    expect(checkUploads([])).toEqual({ ok: true })
  })

  it('refuses more than five', () => {
    const r = checkUploads(Array.from({ length: 6 }, (_, i) => f(`f${i}.pdf`)))
    expect(r.ok).toBe(false)
  })

  it('refuses a file over 10 MB, naming it', () => {
    const r = checkUploads([f('big.pdf', MAX_UPLOAD_BYTES + 1)])
    expect(r).toMatchObject({ ok: false, error: expect.stringContaining('big.pdf') })
  })

  it('refuses an empty file', () => {
    expect(checkUploads([f('nothing.pdf', 0)]).ok).toBe(false)
  })

  it('refuses executables by extension, whatever the case', () => {
    expect(checkUploads([f('setup.EXE')]).ok).toBe(false)
    expect(checkUploads([f('run.sh')]).ok).toBe(false)
  })

  it('refuses a total over 25 MB even when each file is under 10', () => {
    const r = checkUploads([f('a.pdf', 9e6), f('b.pdf', 9e6), f('c.pdf', 9e6)])
    expect(r.ok).toBe(false)
  })
})

describe('fileSize', () => {
  it('reads the way a chip does', () => {
    expect(fileSize(900)).toBe('900 B')
    expect(fileSize(44_209)).toBe('43 KB')
    expect(fileSize(2.5 * 1024 * 1024)).toBe('2.5 MB')
  })
})
