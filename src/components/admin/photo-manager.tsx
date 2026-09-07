'use client'

import Image from 'next/image'
import { useActionState, useEffect, useRef, useState } from 'react'
import { CircleCheck, Trash2, Upload } from 'lucide-react'
import { removePhoto, updatePhoto, uploadPhotos, type AdminState } from '@/app/admin/actions'
import { Input, Labeled, Select, Skeleton, cx } from '@/components/ui'
import { isRenderableImage, photoSrc } from '@/lib/catalog/image-hosts'
import { IMAGE_ROLES, IMAGE_USAGES } from '@/lib/catalog/options'
import { MAX_PHOTOS_PER_UPLOAD } from '@/lib/catalog/photos'
import { fileSize } from '@/lib/email/uploads'

export type AdminPhoto = {
  id: string
  url: string
  role: string
  alt: string
  caption: string | null
  usage: string
  rightsNote: string | null
  foundOnUrl: string | null
}

/*
  The venue's photographs: the ones the extractor found on its website (a
  remote URL, `unverified`) and the ones a venue handed us (in our bucket,
  `venue_supplied`). Both are edited here — role, description, caption,
  usage — and both can be removed. Uploading needs storage configured on the
  server; without it the action says so and nothing else changes.
*/
export function PhotoManager({
  venueId,
  venueName,
  photos,
}: {
  venueId: string
  venueName: string
  photos: AdminPhoto[]
}) {
  return (
    <div className="mt-3 grid gap-4">
      {photos.length > 0 ? (
        <ul className="grid list-none gap-3 p-0 sm:grid-cols-2">
          {photos.map((p) => (
            <PhotoCard key={p.id} photo={p} venueName={venueName} />
          ))}
        </ul>
      ) : (
        <p className="text-body-sm text-text-muted m-0">
          No photographs. The catalog shows an initials tile for this venue.
        </p>
      )}
      <UploadForm venueId={venueId} hasHero={photos.some((p) => p.role === 'hero')} />
    </div>
  )
}

function PhotoCard({ photo, venueName }: { photo: AdminPhoto; venueName: string }) {
  const [state, action, pending] = useActionState<AdminState, FormData>(updatePhoto, {})
  const [settled, setSettled] = useState(false)
  const [failed, setFailed] = useState(false)
  const renderable = isRenderableImage(photo.url) && !failed

  return (
    <li className="bg-surface border-border rounded-card border p-3">
      <div className="bg-thumb relative h-[180px] overflow-hidden rounded-card">
        {renderable ? (
          <>
            {settled ? null : <Skeleton className="absolute inset-0" />}
            <Image
              src={photoSrc(photo.url)}
              alt={photo.alt}
              fill
              sizes="(max-width: 640px) 100vw, 400px"
              className="object-cover"
              onLoad={() => setSettled(true)}
              onError={() => {
                setSettled(true)
                setFailed(true)
              }}
            />
          </>
        ) : (
          <div className="text-meta text-text-muted flex h-full flex-col items-center justify-center gap-1 p-4 text-center">
            <span className="font-semibold">Cannot show this one</span>
            <span className="break-all">{photo.url}</span>
          </div>
        )}
        {photo.role === 'hero' ? (
          <span className="text-label absolute top-2 left-2 rounded-pill bg-white/90 px-2 py-0.5 font-bold uppercase">
            Card photo
          </span>
        ) : null}
      </div>

      <form action={action} className="mt-3 grid gap-2.5">
        <input type="hidden" name="imageId" value={photo.id} />
        <Labeled label="Description" htmlFor={`alt-${photo.id}`}>
          <Input id={`alt-${photo.id}`} name="alt" required defaultValue={photo.alt} />
        </Labeled>
        <Labeled label="Caption" htmlFor={`caption-${photo.id}`}>
          <Input id={`caption-${photo.id}`} name="caption" defaultValue={photo.caption ?? ''} />
        </Labeled>
        <div className="grid grid-cols-2 gap-2.5">
          <Labeled label="Used as" htmlFor={`role-${photo.id}`}>
            <Select id={`role-${photo.id}`} name="role" defaultValue={photo.role}>
              {IMAGE_ROLES.map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </Select>
          </Labeled>
          <Labeled label="Rights" htmlFor={`usage-${photo.id}`}>
            <Select id={`usage-${photo.id}`} name="usage" defaultValue={photo.usage}>
              {IMAGE_USAGES.map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </Select>
          </Labeled>
        </div>
        <p className="text-meta text-text-faint m-0">
          {photo.rightsNote ??
            (photo.foundOnUrl ? `Found on ${photo.foundOnUrl}` : `From ${venueName}'s website`)}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={pending}
            className="border-border-strong bg-surface hover:border-brand text-body-sm text-text-strong h-control rounded-control border px-3.5 font-semibold disabled:opacity-60"
          >
            {pending ? 'Saving' : 'Save'}
          </button>
          {state.ok ? (
            <span key={state.at} className="text-success text-meta flex items-center gap-1 font-semibold">
              <CircleCheck size={16} /> Saved
            </span>
          ) : null}
          {state.error ? <span className="text-warn text-meta">{state.error}</span> : null}
          <span className="flex-1" />
          <RemoveButton id={photo.id} />
        </div>
      </form>
      <form id={`remove-${photo.id}`} action={removePhoto.bind(null, photo.id)} className="hidden" />
    </li>
  )
}

/* The remove is its own form, rendered beside the edit form (a form cannot
   sit inside a form), and the button in the edit form submits it by id. */
function RemoveButton({ id }: { id: string }) {
  return (
    <button
      type="button"
      aria-label="Remove this photo"
      title="Remove this photo"
      onClick={() => {
        if (!window.confirm('Remove this photo from the catalog?')) return
        const f = document.getElementById(`remove-${id}`) as HTMLFormElement | null
        f?.requestSubmit()
      }}
      className="text-text-muted hover:text-danger flex h-control w-control items-center justify-center rounded-control"
    >
      <Trash2 size={18} />
    </button>
  )
}

function UploadForm({ venueId, hasHero }: { venueId: string; hasHero: boolean }) {
  const [state, action, pending] = useActionState<AdminState, FormData>(uploadPhotos, {})
  const [picked, setPicked] = useState<File[]>([])
  const formRef = useRef<HTMLFormElement>(null)

  /* After a successful upload the chosen files are gone from the list the
     server rendered, so the picker should be empty too. */
  useEffect(() => {
    if (state.ok) {
      setPicked([])
      formRef.current?.reset()
    }
  }, [state.ok, state.at])

  return (
    <>
      <form
        ref={formRef}
        action={action}
        className="bg-surface border-border rounded-card border border-dashed p-4"
      >
        <input type="hidden" name="venueId" value={venueId} />
        <div className="text-body-sm font-bold">Add photos the venue sent us</div>
        <p className="text-meta text-text-muted mt-1 mb-3">
          JPEG, PNG or WebP, up to 10 MB each, {MAX_PHOTOS_PER_UPLOAD} at a time. Recorded as
          supplied by the venue, with your name and today&rsquo;s date.
        </p>

        <label className="border-border-strong hover:border-brand text-body-sm text-text-strong flex h-control cursor-pointer items-center gap-2 rounded-control border px-3.5 font-semibold">
          <Upload size={16} />
          {picked.length === 0
            ? 'Choose photos'
            : `${picked.length} chosen · ${fileSize(picked.reduce((n, f) => n + f.size, 0))}`}
          <input
            type="file"
            name="photos"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="sr-only"
            onChange={(e) => setPicked(Array.from(e.target.files ?? []))}
          />
        </label>

        <div className={cx('mt-3 grid gap-2.5 sm:grid-cols-3', picked.length === 0 && 'hidden')}>
          <Labeled label="Used as" htmlFor="upload-role">
            <Select id="upload-role" name="role" defaultValue={hasHero ? 'space' : 'hero'}>
              {IMAGE_ROLES.map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </Select>
          </Labeled>
          <Labeled label="Description" htmlFor="upload-alt" hint="What is in the picture. Read aloud by screen readers.">
            <Input id="upload-alt" name="alt" placeholder="Children at the touch tank" />
          </Labeled>
          <Labeled label="Caption" htmlFor="upload-caption">
            <Input id="upload-caption" name="caption" />
          </Labeled>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <button
            type="submit"
            disabled={pending || picked.length === 0}
            className="bg-brand-solid hover:bg-brand-solid-hover text-body-sm h-control rounded-control px-4 font-bold text-white disabled:opacity-60"
          >
            {pending ? 'Uploading' : 'Upload'}
          </button>
          {state.ok ? (
            <span key={state.at} className="text-success text-meta flex items-center gap-1 font-semibold">
              <CircleCheck size={16} /> Uploaded
            </span>
          ) : null}
          {state.error ? (
            <span className="text-warn text-meta" role="alert">{state.error}</span>
          ) : null}
        </div>
      </form>

    </>
  )
}
