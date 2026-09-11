import { and, eq } from 'drizzle-orm'
import { db, room } from '@/db'
import { getViewer } from '@/lib/auth'
import { mimeOfKey, photoIdOfKey } from '@/lib/rooms/photo'
import { getRoomPhoto } from '@/lib/rooms/photo-storage'

/*
  A room's group photo, read back out of the private `rooms` bucket.

  Only for someone signed in to the centre that owns the room. Anyone else,
  and any photo id that is not the room's current one, gets the same 404, so
  the route does not confirm that a room exists.

  Not through next/image: the optimizer fetches its source without the
  visitor's cookies, and a cache keyed by URL is the wrong place for a private
  picture anyway. The photo is already shrunk before upload.

  The photo id is part of the path and changes whenever the photo does, so
  the browser may keep this for as long as it likes — privately.
*/

const NOT_FOUND = () => new Response('Not found', { status: 404 })

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ roomId: string; photoId: string }> },
) {
  const { roomId, photoId } = await params
  const viewer = await getViewer()
  if (!viewer?.centreId) return NOT_FOUND()

  const row = (
    await db
      .select({ photoKey: room.photoKey })
      .from(room)
      .where(and(eq(room.id, roomId), eq(room.centreId, viewer.centreId)))
      .limit(1)
  )[0]
  if (!row?.photoKey || photoIdOfKey(row.photoKey) !== photoId) return NOT_FOUND()

  const photo = await getRoomPhoto(row.photoKey)
  if (!photo) return new Response('Photo unavailable', { status: 502 })

  return new Response(photo, {
    status: 200,
    headers: {
      'Content-Type': mimeOfKey(row.photoKey),
      'Content-Length': String(photo.size),
      'Cache-Control': 'private, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
