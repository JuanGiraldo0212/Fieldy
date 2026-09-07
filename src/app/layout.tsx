import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, Nunito_Sans } from 'next/font/google'
import './globals.css'
import { TopNav } from '@/components/layout/top-nav'
import {
  HOME_DESCRIPTION,
  HOME_TITLE,
  SITE_NAME,
  jsonLdScript,
  organizationJsonLd,
  websiteJsonLd,
} from '@/lib/seo'
import { siteUrl } from '@/lib/site-url'

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

/*
  What every page inherits. A page that sets only a title gets it suffixed
  with the site name; the catalog and the outing pages replace the
  description and the canonical with their own (src/lib/seo). metadataBase
  is the canonical origin, so a relative canonical or image path resolves
  to www.fieldy.ca and never to the vercel.app alias the deployment also
  answers on.
*/
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: HOME_TITLE,
    template: `%s · ${SITE_NAME}`,
  },
  description: HOME_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_CA',
  },
  twitter: {
    card: 'summary_large_image',
  },
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
        {/* Who we are, for search engines. Native <script>, not next/script:
            this is data, and the JSON-LD guide is explicit that it should be. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(organizationJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(websiteJsonLd()) }}
        />
      </body>
    </html>
  )
}
