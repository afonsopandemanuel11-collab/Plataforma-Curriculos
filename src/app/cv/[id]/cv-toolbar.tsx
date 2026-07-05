'use client'

import { FileText, Printer } from 'lucide-react'
import Link from 'next/link'

interface CVToolbarProps {
  title: string
  language: string
  cvId: string
  isOwner: boolean
}

export default function CVToolbar({ title, language, cvId, isOwner }: CVToolbarProps) {
  return (
    <div className="no-print fixed top-5 left-1/2 -translate-x-1/2 bg-[#1a3a5c]/95 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-glass z-50 flex items-center gap-4">
      <div className="flex items-center gap-2 border-r border-white/20 pr-4">
        <FileText className="w-4.5 h-4.5 text-amber-400" />
        <span className="text-xs font-bold truncate max-w-[150px]">{title}</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => window.print()}
          className="text-xs font-semibold hover:text-amber-300 transition-colors flex items-center gap-1"
        >
          <Printer className="w-4 h-4" /> {language === 'pt' ? 'Imprimir / Guardar PDF' : 'Print / Save PDF'}
        </button>
        {isOwner && (
          <Link
            href={`/dashboard/cv/${cvId}`}
            className="text-xs bg-white/10 hover:bg-white/20 px-3.5 py-1.5 rounded-full font-semibold transition-colors"
          >
            {language === 'pt' ? 'Editar Documento' : 'Edit Document'}
          </Link>
        )}
      </div>
    </div>
  )
}
