'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation';

const LoadingStep = ({ title, isComplete }: { title: string; isComplete: boolean }) => (
  <div className="flex items-center gap-4 py-2">
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${isComplete ? 'bg-green-500' : 'bg-gray-400 animate-pulse'}`}>
      {isComplete ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <div className="w-4 h-4 rounded-full bg-white opacity-50"></div>
      )}
    </div>
    <span className={`text-lg ${isComplete ? 'text-gray-200' : 'text-white'}`}>{title}</span>
  </div>
);

export default function ScrapePage() {
  const searchParams = useSearchParams();
  const sourceDomain = searchParams.get('sourceDomain');
  const targetDomain = searchParams.get('targetDomain');
  const [srcDone, setSrcDone] = useState(false)
  const [tgtDone, setTgtDone] = useState(false)
  const [emailDone, setEmailDone] = useState(false)
  const [srcSummary, setSrcSummary] = useState('')
  const [tgtSummary, setTgtSummary] = useState('')
  const [emails, setEmails] = useState<string[]>([])

  useEffect(() => {
    const es = new EventSource(
      `https://userled-backend.onrender.com/stream-scrape?source=${sourceDomain}&target=${targetDomain}`
    )

    es.addEventListener('sourceSummary', (e) => {
      const { summary } = JSON.parse(e.data)
      setSrcSummary(summary)
      setSrcDone(true)
    })
    es.addEventListener('targetSummary', (e) => {
      const { summary } = JSON.parse(e.data)
      setTgtSummary(summary)
      setTgtDone(true)
    })
    es.addEventListener('emails', (e) => {
      const { emails } = JSON.parse(e.data)
      setEmails(emails)
      setEmailDone(true)
      es.close()
    })

    return () => es.close()
  }, [sourceDomain, targetDomain])

  return (
    <main
          className="flex min-h-screen flex-col items-center justify-center p-8 bg-cover bg-center"
          style={{
            backgroundImage: `url(https://cdn.prod.website-files.com/66543b899126d2bc98585ae7/6703b253e26cb67b1b2bb0e9_Group%201400001781.avif)`,
          }}
        >
      <LoadingStep title="Source scraped & summarised" isComplete={srcDone} />
      {srcDone && <pre>{srcSummary}</pre>}

      <LoadingStep title="Target scraped & summarised" isComplete={tgtDone} />
      {tgtDone && <pre>{tgtSummary}</pre>}

      <LoadingStep title="Emails scraped" isComplete={emailDone} />
      {emailDone && (
        <ul>
          {emails.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}
    </main>
  )
}
