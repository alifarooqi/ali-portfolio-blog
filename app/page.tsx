import { Suspense } from 'react'
import { BlogPosts } from 'app/components/posts'
import TopSection from './components/sections/TopSection/TopSection'
import ProjectSection from './components/sections/ProjectSection/ProjectSection'
import ReviewSection from './components/sections/ReviewSection/ReviewSection'
import AboutSection from './components/sections/AboutSection/AboutSection'
import { Skeleton } from '@mui/material'

export default function Page() {
  return (
    <>
      <TopSection />

      <Suspense fallback={<Skeleton animation="wave" variant="rectangular" width="100%" height={300} sx={{ bgcolor: 'var(--text-secondary)' }} />}>
        <ProjectSection />
        <AboutSection />
        <ReviewSection />
      </Suspense>
    </>
  )
}
