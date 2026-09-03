import { redirect } from 'next/navigation'
import { getActiveRoom, getCentre, getRooms, getViewer } from '@/lib/auth'
import { RoomsScreen } from '@/components/rooms/rooms-screen'
import type { EditableRoom } from '@/components/rooms/room-dialog'

export default async function RoomsPage() {
  const viewer = await getViewer()
  if (!viewer) redirect('/login?next=/rooms')
  if (!viewer.centreId) redirect('/welcome?next=/rooms')

  const [rooms, centre, active] = await Promise.all([
    getRooms(viewer.centreId),
    getCentre(viewer.centreId),
    getActiveRoom(viewer.centreId),
  ])

  return (
    <main className="mx-auto max-w-content px-5 pt-8 pb-16">
      <RoomsScreen
        rooms={rooms as unknown as EditableRoom[]}
        centreAddress={centre?.address ?? ''}
        activeRoomId={active?.id ?? null}
      />
    </main>
  )
}
