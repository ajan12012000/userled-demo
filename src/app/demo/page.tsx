import React, { Suspense } from 'react'
import ScrapePage from './ScrapePage'

export default function DemoPage() {
  return (
    <Suspense fallback={<div>Loading demo…</div>}>
      <ScrapePage />
    </Suspense>
  )
}