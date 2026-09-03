'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { Check, MapPin } from 'lucide-react'
import { cx } from '@/components/ui'

/*
  Address entry with suggestions. spec §5.8: "Address entry uses autocomplete
  or a map pin; distance calculations depend on it."

  Picking a suggestion carries its coordinates through in hidden fields, so the
  server stores exactly the point the director saw rather than geocoding her
  text a second time and possibly landing somewhere else.

  Typing free text still works. The geocoder is a convenience, not a gate: if
  it is slow, down, or simply does not know a rural address, the form still
  submits and the server falls back to geocoding the string.
*/

type Suggestion = { label: string; lat: number; lng: number }

export function AddressField({
  name = 'address',
  label = 'Address',
  defaultValue = '',
  hint,
  required,
}: {
  name?: string
  label?: string
  defaultValue?: string
  hint?: string
  required?: boolean
}) {
  const [value, setValue] = useState(defaultValue)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const [picked, setPicked] = useState<Suggestion | null>(null)
  const [loading, setLoading] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)
  const listId = useId()

  /* Debounced. Nominatim asks for one request a second and a director types
     faster than that. */
  useEffect(() => {
    const q = value.trim()
    if (q.length < 3 || picked?.label === q) {
      setSuggestions([])
      return
    }
    let cancelled = false
    setLoading(true)
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/geocode/suggest?q=${encodeURIComponent(q)}`)
        const json = (await res.json()) as { suggestions: Suggestion[] }
        if (!cancelled) {
          setSuggestions(json.suggestions ?? [])
          setOpen((json.suggestions ?? []).length > 0)
          setActive(-1)
        }
      } catch {
        if (!cancelled) setSuggestions([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }, 450)
    return () => {
      cancelled = true
      clearTimeout(t)
      setLoading(false)
    }
  }, [value, picked])

  /* Clicking away closes the list without choosing anything. */
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  function choose(s: Suggestion) {
    setPicked(s)
    setValue(s.label)
    setOpen(false)
    setSuggestions([])
  }

  return (
    <div ref={boxRef} className="relative">
      <div className="text-label text-text-muted mb-1.5 font-bold uppercase">
        {label}
      </div>

      {/* Only sent when a suggestion was chosen. The server treats their
          absence as "geocode the text". */}
      {picked && picked.label === value ? (
        <>
          <input type="hidden" name={`${name}Lat`} value={picked.lat} />
          <input type="hidden" name={`${name}Lng`} value={picked.lng} />
        </>
      ) : null}

      <div className="border-border-strong bg-surface text-body-sm text-text flex h-control items-center gap-2.5 rounded-control border px-3 font-semibold">
        <span className="text-brand flex">
          <MapPin size={18} />
        </span>
        <input
          name={name}
          required={required}
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            setPicked(null)
          }}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          onKeyDown={(e) => {
            if (!open || suggestions.length === 0) return
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              setActive((i) => (i + 1) % suggestions.length)
            } else if (e.key === 'ArrowUp') {
              e.preventDefault()
              setActive((i) => (i - 1 + suggestions.length) % suggestions.length)
            } else if (e.key === 'Enter' && active >= 0) {
              /* Enter picks the highlighted suggestion instead of submitting
                 the whole form, which would skip the coordinates. */
              e.preventDefault()
              choose(suggestions[active]!)
            } else if (e.key === 'Escape') {
              setOpen(false)
            }
          }}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          autoComplete="off"
          placeholder="Start typing, then pick your address"
          className="text-body-sm w-full border-0 bg-transparent font-semibold outline-none"
        />
        {picked && picked.label === value ? (
          <span className="text-success flex" aria-label="Address confirmed">
            <Check size={17} />
          </span>
        ) : loading ? (
          <span className="text-meta-sm text-text-faint">…</span>
        ) : null}
      </div>

      {open && suggestions.length > 0 ? (
        <ul
          id={listId}
          role="listbox"
          className="bg-surface border-border-strong shadow-popover absolute z-30 mt-1 w-full list-none overflow-hidden rounded-card border p-0"
        >
          {suggestions.map((s, i) => (
            <li key={`${s.lat},${s.lng},${i}`} role="option" aria-selected={i === active}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(s)}
                className={cx(
                  'text-body-sm block w-full px-3.5 py-2.5 text-left',
                  i === active ? 'bg-surface-3' : 'bg-surface',
                )}
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {hint ? <p className="text-meta text-text-faint mt-1.5">{hint}</p> : null}
    </div>
  )
}
