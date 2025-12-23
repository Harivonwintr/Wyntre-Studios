import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav'
import ConditionalHero from '@/components/ConditionalHero'
import PageTransition from '@/components/PageTransition'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
})

export const metadata: Metadata = {
  title: 'Wyntre Studios',
  description: 'Creative solutions through post, for brands and directors who can\'t afford to get it wrong.',
  icons: {
    icon: '/assets/favicon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Preload primary heading font */}
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
        <style dangerouslySetInnerHTML={{
          __html: `
            @font-face {
              font-family: 'Monument Extended Regular';
              font-display: swap;
            }
            @font-face {
              font-family: 'Monument Extended Bold';
              font-display: swap;
            }
            @font-face {
              font-family: 'PP Hatton';
              font-display: swap;
            }
          `
        }} />
      </head>
      <body className={inter.variable}>
        <Nav />
        <ConditionalHero />
        <PageTransition>
          {children}
        </PageTransition>
      </body>
    </html>
  )
}

