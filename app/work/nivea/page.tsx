import CaseStudy from '@/components/CaseStudy'
import { pageMeta } from '@/utils/seo'
import { niveaCaseStudy } from '@/data/caseStudies'

export const metadata = pageMeta({
  title: 'NIVEA: Skin is for feeling it',
  description: niveaCaseStudy.intro,
  image: '/og/nivea.jpg',
  imageAlt: 'NIVEA case study',
})

export default function NiveaCaseStudyPage() {
  return <CaseStudy study={niveaCaseStudy} />
}
