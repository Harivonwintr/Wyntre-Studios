import CaseStudy from '@/components/CaseStudy'
import { pageMeta } from '@/utils/seo'
import { nescafeCaseStudy } from '@/data/caseStudies'

export const metadata = pageMeta({
  title: 'NESCAFÉ: Built to scale',
  description: nescafeCaseStudy.intro,
  image: '/og/nescafe.jpg',
  imageAlt: 'NESCAFÉ case study',
})

export default function NescafeCaseStudyPage() {
  return <CaseStudy study={nescafeCaseStudy} />
}
