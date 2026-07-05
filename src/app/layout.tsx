import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'CurriculumAI — Currículos Académicos com IA',
    template: '%s | CurriculumAI',
  },
  description: 'Plataforma inteligente para criação, organização e geração automática de currículos científicos académicos.',
  keywords: ['currículo', 'académico', 'CV', 'inteligência artificial', 'Angola', 'universidade', 'investigação'],
  authors: [{ name: 'CurriculumAI' }],
  openGraph: {
    type: 'website',
    locale: 'pt_PT',
    siteName: 'CurriculumAI',
    title: 'CurriculumAI — Currículos Académicos com IA',
    description: 'Plataforma inteligente para criação e gestão de currículos académicos com inteligência artificial.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  )
}
