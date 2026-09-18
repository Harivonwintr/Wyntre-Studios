import { pageMeta, SITE_NAME } from '@/utils/seo'

// The page itself is a client component, so its title and link preview live here
export const metadata = {
  ...pageMeta({
    title: 'Work',
    description: 'Case studies, the film library and rescue stories: campaigns for NIVEA, NESCAFÉ, Subway, Visa and more.',
  }),
  // A plain title here would stop the site name being added to the case study pages below it
  title: { absolute: `Work | ${SITE_NAME}`, template: `%s | ${SITE_NAME}` },
}

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return children
}
