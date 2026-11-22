'use client'

import { useEffect, useRef } from 'react'

const CLIENT_ID = 'ca-pub-5064597228574782'

export default function AdSlot({ slot }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!slot || !ref.current) return
    if (ref.current.dataset.adsbygoogleStatus) return
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // Abaikan jika script iklan diblokir
    }
  }, [slot])

  if (!slot) return null

  return (
    <div className="ad-wrap" aria-label="Iklan">
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
