import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import StoryArticle from '@/components/StoryArticle'
import { getStory, stories } from '@/data/stories'
import { pageMeta } from '@/utils/seo'

type Params = { params: { slug: string } }

export function generateStaticParams() {
  return stories.map((story) => ({ slug: story.slug }))
}

export function generateMetadata({ params }: Params): Metadata {
  const story = getStory(params.slug)
  if (!story) return {}
  return {
    ...pageMeta({
      title: `${story.client} ${story.campaign}: Rescue story`,
      description: story.result,
      image: `/og/story-${story.slug}.jpg`,
      imageAlt: story.imageAlt,
    }),
    // Keep unfinished stories out of search results until they're published
    robots: story.draft ? { index: false, follow: true } : undefined,
  }
}

export default function StoryPage({ params }: Params) {
  const story = getStory(params.slug)
  if (!story) notFound()
  return <StoryArticle story={story} />
}
