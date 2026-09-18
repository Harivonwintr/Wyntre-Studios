import type { Metadata, Viewport } from 'next'
import { Inter, Anton, IBM_Plex_Mono, Oswald } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav'
import ConditionalHero from '@/components/ConditionalHero'
import PageTransition from '@/components/PageTransition'
import MotionProvider from '@/components/MotionProvider'
import { pageMeta, SITE_NAME, SITE_URL } from '@/utils/seo'

// Turns scroll reveals on before first paint so content doesn't flash in and then hide.
// Falls back to showing everything if the motion script hasn't started within 4s.
const MOTION_BOOT = `(function(){try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;var d=document.documentElement;d.setAttribute('data-motion','ready');setTimeout(function(){if(!d.hasAttribute('data-motion-live'))d.removeAttribute('data-motion')},4000)}catch(e){}})()`

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
})

// Our Work collage: condensed titles and highlight lists
const oswald = Oswald({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  display: 'swap',
  variable: '--font-oswald',
})

// Campaign showcase typography: display headings and mono labels
const anton = Anton({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-anton',
  preload: false,
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-mono',
  preload: false,
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Default link preview; pages with their own card override it
  ...pageMeta({
    description: 'Creative solutions through post, for brands and directors who can\'t afford to get it wrong.',
  }),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  icons: {
    icon: '/assets/favicon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0D1117',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${anton.variable} ${plexMono.variable} ${oswald.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: MOTION_BOOT }} />
        {/* Load Monument Extended Regular first - critical for headings and nav */}
        <link
          rel="preload"
          href="https://db.onlinewebfonts.com/c/99501fdab737541e9315ceaf9229370f?family=Monument+Extended+Regular"
          as="style"
        />
        <link
          href="https://db.onlinewebfonts.com/c/99501fdab737541e9315ceaf9229370f?family=Monument+Extended+Regular"
          rel="stylesheet"
        />
        {/* Load other fonts */}
        <link
          href="https://db.onlinewebfonts.com/c/55d433372d270829c51e2577a78ef12d?family=Monument+Extended+Bold"
          rel="stylesheet"
        />
        <link
          href="https://db.onlinewebfonts.com/c/3147420f5573b22000d1e233cae7cdc9?family=PP+Hatton"
          rel="stylesheet"
        />
      </head>
      <body>
        <MotionProvider />
        <Nav />
        <ConditionalHero />
        <PageTransition>
          {children}
        </PageTransition>
      </body>
    </html>
  )
}

