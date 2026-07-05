'use client'

import { useEffect } from 'react'

export default function PrintHelper() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('print') === 'true') {
      // Pequeno atraso para garantir renderização total do CSS
      const timer = setTimeout(() => {
        window.print()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [])

  return null
}
