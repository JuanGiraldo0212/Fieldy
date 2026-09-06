import { notFound, redirect } from 'next/navigation'
import { getViewer, type Viewer } from '@/lib/auth'

/*
  What every /admin page does first. Signed out goes to login and comes back;
  signed in but not an admin gets a 404 rather than a 403, so the route's
  existence is not announced to anyone who guesses it. Server actions do NOT
  use this — they return an error string through requireAdmin() instead,
  because a redirect from inside an action is the wrong shape of answer.
*/
export async function adminPage(next: string): Promise<Viewer> {
  const viewer = await getViewer()
  if (!viewer) redirect(`/login?next=${encodeURIComponent(next)}`)
  if (!viewer.isAdmin) notFound()
  return viewer
}
