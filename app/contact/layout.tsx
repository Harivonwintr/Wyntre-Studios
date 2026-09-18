import { pageMeta } from '@/utils/seo'

// The page itself is a client component, so its title and link preview live here
export const metadata = pageMeta({
  title: 'Contact',
  description: 'Start a project with Wyntre Studios. A few lines is plenty.',
})

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
