'use client'

import { useState } from 'react'
import Link from 'next/link'
import { deleteCurriculum, updateCurriculum } from '@/lib/actions/cv'
import { Plus, FileText, Trash2, Edit2, Eye, EyeOff, Globe, Sparkles, ExternalLink, ArrowRight } from 'lucide-react'

interface CurriculumItem {
  id: string
  title: string
  template_name: string
  language: string
  ai_generated: boolean
  is_public: boolean
  is_default: boolean
  view_count: number
  created_at: string
}

interface CVListClientProps {
  initialCVs: CurriculumItem[]
}

export default function CVListClient({ initialCVs }: CVListClientProps) {
  const [cvs, setCvs] = useState<CurriculumItem[]>(initialCVs)

  async function handleDelete(id: string) {
    if (!confirm('Tens a certeza que queres eliminar este currículo permanentemente?')) return
    try {
      await deleteCurriculum(id)
      setCvs(cvs.filter(cv => cv.id !== id))
    } catch (err: any) {
      alert('Erro ao eliminar currículo: ' + err.message)
    }
  }

  async function handleTogglePublic(cv: CurriculumItem) {
    try {
      const newPublic = !cv.is_public
      await updateCurriculum(cv.id, { is_public: newPublic })
      setCvs(cvs.map(item => (item.id === cv.id ? { ...item, is_public: newPublic } : item)))
    } catch (err: any) {
      alert('Erro ao alterar visibilidade: ' + err.message)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header action */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <FileText className="w-5 h-5 text-brand-600" /> Os Meus Documentos
        </h2>
        <Link
          href="/dashboard/cv/new"
          className="btn-primary px-4 py-2 rounded-xl text-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Criar Currículo
        </Link>
      </div>

      {!cvs.length ? (
        <div className="bg-white/80 border border-gray-100 rounded-3xl p-12 text-center shadow-card">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-4 text-brand-500">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Ainda não tem currículos</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
            Crie um currículo estruturado nas normas académicas portuguesas e angolanas com assistência de IA.
          </p>
          <Link
            href="/dashboard/cv/new"
            className="btn-primary px-6 py-3 rounded-2xl inline-flex items-center gap-2"
          >
            Criar o primeiro CV <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {cvs.map(cv => (
            <div
              key={cv.id}
              className="bg-white/80 border border-gray-100 rounded-3xl p-6 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-bold text-gray-900 leading-tight text-base">
                    {cv.title}
                  </h3>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleTogglePublic(cv)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        cv.is_public
                          ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
                          : 'bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                      }`}
                      title={cv.is_public ? 'Tornar Privado' : 'Tornar Público / Partilhar'}
                    >
                      {cv.is_public ? <Globe className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDelete(cv.id)}
                      className="p-1.5 bg-white border border-gray-200 hover:bg-red-50 hover:border-red-200 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 font-medium mb-6">
                  <span className="capitalize bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md text-gray-600">
                    Template: {cv.template_name}
                  </span>
                  <span>•</span>
                  <span className="uppercase">{cv.language}</span>
                  {cv.ai_generated && (
                    <>
                      <span>•</span>
                      <span className="inline-flex items-center gap-0.5 text-brand-600 font-bold bg-brand-50/50 border border-brand-100 px-2 py-0.5 rounded-md">
                        <Sparkles className="w-3 h-3 text-amber-500" /> IA
                      </span>
                    </>
                  )}
                  <span>•</span>
                  <span>{cv.view_count} Visualizações</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-100/70">
                <Link
                  href={`/dashboard/cv/${cv.id}`}
                  className="flex-1 btn-secondary text-center py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Editar Configurações
                </Link>
                {cv.is_public && (
                  <Link
                    href={`/cv/${cv.id}`}
                    target="_blank"
                    className="btn-ghost border border-gray-100 p-2.5 rounded-xl text-gray-500 hover:text-gray-900"
                    title="Ver página partilhada"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
