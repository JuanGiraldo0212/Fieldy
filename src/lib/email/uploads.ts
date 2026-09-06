/*
  What an educator may attach to a follow-up. Pure, so the compose box and
  the server action apply the same rule and the message the director reads
  is the same on both sides.

  The limits mirror the inbound side: 10 MB per file, which is where
  MAX_ATTACHMENT_BYTES sits, and a handful of files rather than a folder —
  a booking form, a consent template, a photo of the group. Resend caps a
  whole message at 40 MB, so the total stays well under that.

  Executables are refused by extension. A venue's mail filter would refuse
  them anyway, and a bounce for that reason reads as Fieldy being broken.
*/

export const MAX_UPLOAD_FILES = 5
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024
export const MAX_UPLOAD_TOTAL_BYTES = 25 * 1024 * 1024

const BLOCKED_EXTENSIONS = new Set([
  'exe', 'msi', 'bat', 'cmd', 'com', 'scr', 'pif', 'js', 'jse', 'vbs', 'vbe',
  'wsf', 'wsh', 'ps1', 'jar', 'sh', 'app', 'dmg', 'apk', 'lnk', 'reg', 'hta',
])

export type UploadLike = { name: string; size: number; type: string }

export type UploadCheck = { ok: true } | { ok: false; error: string }

export function checkUploads(files: UploadLike[]): UploadCheck {
  if (files.length > MAX_UPLOAD_FILES) {
    return { ok: false, error: `Up to ${MAX_UPLOAD_FILES} files at a time.` }
  }
  let total = 0
  for (const f of files) {
    if (f.size === 0) {
      return { ok: false, error: `${f.name} is empty.` }
    }
    if (f.size > MAX_UPLOAD_BYTES) {
      return { ok: false, error: `${f.name} is over 10 MB. Venues' mailboxes rarely take more.` }
    }
    const ext = f.name.toLowerCase().split('.').pop() ?? ''
    if (ext && BLOCKED_EXTENSIONS.has(ext)) {
      return { ok: false, error: `${f.name} is a kind of file mail systems refuse.` }
    }
    total += f.size
  }
  if (total > MAX_UPLOAD_TOTAL_BYTES) {
    return { ok: false, error: 'Those files add up to more than 25 MB. Send fewer at a time.' }
  }
  return { ok: true }
}

export function fileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
