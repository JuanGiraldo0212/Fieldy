import { redirect } from 'next/navigation'

/* Plan §6: the design has no standalone saved screen. Saved is a tab on
   My trips, and this address just goes there. */
export function GET() {
  redirect('/trips?tab=saved')
}
