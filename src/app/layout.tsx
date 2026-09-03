import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, Nunito_Sans } from 'next/font/google'
import './globals.css'
import { TopNav } from '@/components/layout/top-nav'

// next/font downloads these at build time and serves them from our own origin.
// No runtime request to Google, which is what "self-hosted" means here.
const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-bricolage',
  display: 'swap',
})

const nunito = Nunito_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-nunito',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Fieldy',
  description:
    'Find your next field trip. Search, contact venues, and keep everything in one place.',
}

// Mobile first: the design is built at 390px.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${bricolage.variable} ${nunito.variable}`}>
      <body>
        <TopNav />
        {children}
      </body>
    </html>
  )
}
