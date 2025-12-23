'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Footer from '@/components/Footer'
import CaseStudyModal from '@/components/CaseStudyModal'
import { workItems, getWorkItemBySlug } from '@/data/workItems'
import { caseStudyItems } from '@/data/caseStudyItems'

export default function WorkItemPage() {
  const params = useParams()
  const router = useRouter()
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug || ''
  const [isModalOpen, setIsModalOpen] = useState(true)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const item = getWorkItemBySlug(slug)

  useEffect(() => {
    if (!item) {
      router.push('/work')
      return
    }

    // Find matching case study item
    const normalize = (str: string) => str.toLowerCase().replace(/\s*&\s*/g, ' and ').trim()
    const index = caseStudyItems.findIndex(
      (csItem) =>
        csItem.client.toLowerCase() === item.client.toLowerCase() &&
        normalize(csItem.campaign) === normalize(item.campaign)
    )

    if (index >= 0) {
      setSelectedIndex(index)
    } else {
      // If no matching case study found, redirect to work page
      router.push('/work')
    }
  }, [item, router])

  if (!item) {
    return null
  }

  const handleClose = () => {
    setIsModalOpen(false)
    router.push('/work')
  }

  return (
    <>
      <div style={{ minHeight: '100vh', paddingTop: '120px' }}>
        <div className="container">
          <h1>{item.client} | {item.campaign}</h1>
          <p>Redirecting to modal...</p>
        </div>
      </div>
      <CaseStudyModal
        isOpen={isModalOpen}
        onClose={handleClose}
        items={caseStudyItems}
        initialIndex={selectedIndex}
      />
      <Footer />
    </>
  )
}

