'use client'

import { useState } from 'react'
import { updateCurriculum } from '@/lib/actions/cv'
import {
  Sparkles,
  Save,
  Globe,
  Eye,
  EyeOff,
  Printer,
  ChevronLeft,
  FileText,
  Languages,
  Layout,
  ExternalLink,
  BookOpen
} from 'lucide-react'
import Link from 'next/link'

interface CVData {
  id: string
  title: string
  summary?: string | null
  template_name: 'academic' | 'research' | 'industry' | 'minimal'
  language: string
  is_public: boolean
  is_default: boolean
  ai_generated: boolean
}

interface FullCVRelations {
  profile: any
  education: any[]
  experiences: any[]
  publications: any[]
  projects: any[]
  certifications: any[]
  skills: any[]
  languages: any[]
  awards: any[]
  references: any[]
}

interface CVEditorClientProps {
  cv: CVData
  cvData: FullCVRelations
}

export default function CVEditorClient({ cv, cvData }: CVEditorClientProps) {
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  
  // States of metadata
  const [title, setTitle] = useState(cv.title)
  const [templateName, setTemplateName] = useState(cv.template_name)
  const [language, setLanguage] = useState(cv.language)
  const [isPublic, setIsPublic] = useState(cv.is_public)
  const [summary, setSummary] = useState(cv.summary ?? '')

  // AI Assistant states
  const [aiLoading, setIaLoading] = useState(false)

  async function handleImproveSummary() {
    if (!summary.trim() && !cvData.profile?.bio) {
      alert('Por favor, escreva algum resumo inicial ou complete a sua Biografia no Perfil.')
      return
    }
    setIaLoading(true)
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_summary',
          context: {
            full_name: cvData.profile?.full_name || 'Académico',
            bio: summary || cvData.profile?.bio || '',
            institution: cvData.profile?.institution || '',
            academic_level: cvData.profile?.academic_level || '',
          },
        }),
      })
      const data = await response.json()
      if (data.error) throw new Error(data.error)
      if (data.text) {
        setSummary(data.text)
        setSuccessMsg('Resumo profissional otimizado com IA!')
        setTimeout(() => setSuccessMsg(null), 3000)
      }
    } catch (err: any) {
      alert('Erro ao otimizar resumo: ' + err.message)
    } finally {
      setIaLoading(false)
    }
  }

  async function handleSaveMetadata(newPublicValue?: boolean) {
    setLoading(true)
    setSuccessMsg(null)
    const publicState = newPublicValue !== undefined ? newPublicValue : isPublic
    try {
      await updateCurriculum(cv.id, {
        title,
        template_name: templateName,
        language,
        is_public: publicState,
        summary,
      })
      setSuccessMsg('Alterações guardadas com sucesso!')
      setTimeout(() => setSuccessMsg(null), 3000)
    } catch (err: any) {
      alert('Erro ao guardar alterações: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 border border-gray-100 rounded-3xl p-5 shadow-card">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/cv" className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">{title}</h1>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mt-0.5">Editor de Currículo</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isPublic && (
            <Link
              href={`/cv/${cv.id}`}
              target="_blank"
              className="btn-secondary px-4 py-2 rounded-xl text-xs flex items-center gap-1.5"
            >
              <ExternalLink className="w-4 h-4" /> Ver Partilha
            </Link>
          )}
          <button
            onClick={() => {
              window.open(`/cv/${cv.id}?print=true`, '_blank')
            }}
            className="btn-secondary px-4 py-2 rounded-xl text-xs flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" /> Imprimir / PDF
          </button>
          <button
            onClick={() => handleSaveMetadata()}
            className="btn-primary px-5 py-2 rounded-xl text-xs flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" /> Guardar
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-green-50 border border-green-100 rounded-2xl text-xs text-green-700 font-semibold animate-fade-in">
          ✅ {successMsg}
        </div>
      )}

      {/* Editor & Preview Workspace */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Metadata and summary editor (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Settings Card */}
          <div className="bg-white/80 border border-gray-100 rounded-3xl p-6 shadow-card space-y-4">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 border-b border-gray-50 pb-2">
              <Layout className="w-4 h-4 text-brand-600" /> Configuração do Layout
            </h3>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Título Interno</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="input-field text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Template</label>
                <select
                  value={templateName}
                  onChange={e => setTemplateName(e.target.value as any)}
                  className="input-field text-sm"
                >
                  <option value="academic">Academic Classic</option>
                  <option value="research">Modern Research</option>
                  <option value="minimal">Minimal Clean</option>
                  <option value="industry">Industry Pro</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Idioma</label>
                <select
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  className="input-field text-sm"
                >
                  <option value="pt">Português</option>
                  <option value="en">Inglês</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-gray-50">
              <div>
                <label className="text-xs font-bold text-gray-800 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-brand-600" /> Currículo Público
                </label>
                <p className="text-[10px] text-gray-400 mt-0.5">Tornar o link público e partilhável na web.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newVal = !isPublic
                  setIsPublic(newVal)
                  handleSaveMetadata(newVal)
                }}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none ${
                  isPublic ? 'bg-brand-600' : 'bg-gray-200'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                    isPublic ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* AI Professional Summary */}
          <div className="bg-white/80 border border-gray-100 rounded-3xl p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-gray-50 pb-2">
              <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-brand-600" /> Resumo do Currículo
              </h3>
              <button
                onClick={handleImproveSummary}
                disabled={aiLoading}
                className="text-[10px] bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors disabled:opacity-50"
              >
                {aiLoading ? (
                  'A processar...'
                ) : (
                  <>
                    <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" /> IA Gemini
                  </>
                )}
              </button>
            </div>

            <textarea
              value={summary}
              onChange={e => setSummary(e.target.value)}
              rows={6}
              placeholder="Descreva as suas maiores conquistas e áreas de especialidade científica para este documento específico..."
              className="input-field text-xs resize-none"
            />
          </div>

          {/* Data Pool Quick Links */}
          <div className="bg-white/80 border border-gray-100 rounded-3xl p-6 shadow-card space-y-3">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Editar Dados Centrais</h4>
            <p className="text-[11px] text-gray-400">
              O currículo carrega automaticamente a informação das suas secções. Adicione dados nas páginas centrais:
            </p>
            <div className="grid grid-cols-2 gap-2 text-center">
              <Link href="/dashboard/profile" className="text-xs bg-gray-50 hover:bg-gray-100 border border-gray-100 py-2 rounded-xl font-medium text-gray-600 transition-colors">
                Perfil
              </Link>
              <Link href="/dashboard/education" className="text-xs bg-gray-50 hover:bg-gray-100 border border-gray-100 py-2 rounded-xl font-medium text-gray-600 transition-colors">
                Formação
              </Link>
              <Link href="/dashboard/experience" className="text-xs bg-gray-50 hover:bg-gray-100 border border-gray-100 py-2 rounded-xl font-medium text-gray-600 transition-colors">
                Experiência
              </Link>
              <Link href="/dashboard/publications" className="text-xs bg-gray-50 hover:bg-gray-100 border border-gray-100 py-2 rounded-xl font-medium text-gray-600 transition-colors">
                Publicações
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side: Real-time paper preview (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-glass overflow-y-auto max-h-[85vh] scrollbar-thin">
          <div className="flex justify-between items-center border-b border-gray-50 pb-3 mb-6">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Preview Digital (A4)</span>
            <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded font-semibold uppercase">
              {templateName}
            </span>
          </div>

          {/* Render Curriculum depending on Selected Template */}
          <div className="space-y-6 text-gray-800 text-xs">
            {/* Header info */}
            <div className="text-center space-y-1 pb-4 border-b border-gray-200">
              <h1 className="text-lg font-bold text-gray-900">{cvData.profile?.full_name}</h1>
              {cvData.profile?.academic_level && (
                <p className="text-[11px] font-semibold text-gray-600 capitalize">
                  {cvData.profile.academic_level.replace('_', ' ')}
                  {cvData.profile.institution ? ` · ${cvData.profile.institution}` : ''}
                </p>
              )}
              <div className="flex flex-wrap justify-center gap-3 text-[10px] text-gray-400 font-medium">
                {cvData.profile?.email && <span>{cvData.profile.email}</span>}
                {cvData.profile?.phone && <span>{cvData.profile.phone}</span>}
                {cvData.profile?.nationality && <span>{cvData.profile.nationality}</span>}
                {cvData.profile?.orcid_id && (
                  <span className="text-brand-600">ORCID: {cvData.profile.orcid_id}</span>
                )}
              </div>
            </div>

            {/* Summary */}
            {summary && (
              <div className="space-y-1.5">
                <h3 className="font-bold text-[#1a3a5c] text-[11px] uppercase tracking-wider border-b border-gray-100 pb-1">
                  {language === 'pt' ? 'Resumo Profissional' : 'Professional Summary'}
                </h3>
                <p className="text-xs leading-relaxed text-gray-600">{summary}</p>
              </div>
            )}

            {/* Education */}
            {cvData.education.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-bold text-[#1a3a5c] text-[11px] uppercase tracking-wider border-b border-gray-100 pb-1">
                  {language === 'pt' ? 'Formação Académica' : 'Education'}
                </h3>
                <div className="space-y-2">
                  {cvData.education.map((edu: any) => (
                    <div key={edu.id} className="flex justify-between items-start gap-4">
                      <div>
                        <div className="font-bold text-gray-800">
                          {edu.degree} em {edu.field_of_study}
                        </div>
                        <div className="text-gray-500">{edu.institution}</div>
                      </div>
                      <div className="text-right shrink-0 text-gray-400 text-[10px] font-medium">
                        {edu.start_date ? new Date(edu.start_date).getFullYear() : ''} -{' '}
                        {edu.is_current ? 'Presente' : edu.end_date ? new Date(edu.end_date).getFullYear() : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            {cvData.experiences.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-bold text-[#1a3a5c] text-[11px] uppercase tracking-wider border-b border-gray-100 pb-1">
                  {language === 'pt' ? 'Experiência Profissional' : 'Professional Experience'}
                </h3>
                <div className="space-y-3">
                  {cvData.experiences.map((exp: any) => (
                    <div key={exp.id} className="space-y-1">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <div className="font-bold text-gray-800">{exp.role}</div>
                          <div className="text-gray-500">{exp.organization}</div>
                        </div>
                        <div className="text-right shrink-0 text-gray-400 text-[10px] font-medium">
                          {exp.start_date ? new Date(exp.start_date).getFullYear() : ''} -{' '}
                          {exp.is_current ? 'Presente' : exp.end_date ? new Date(exp.end_date).getFullYear() : ''}
                        </div>
                      </div>
                      {exp.description && (
                        <p className="text-gray-500 text-[11px] leading-relaxed pl-1 border-l border-gray-100">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Publications */}
            {cvData.publications.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-bold text-[#1a3a5c] text-[11px] uppercase tracking-wider border-b border-gray-100 pb-1">
                  {language === 'pt' ? 'Publicações Científicas' : 'Scientific Publications'}
                </h3>
                <div className="space-y-2">
                  {cvData.publications.map((pub: any) => (
                    <div key={pub.id} className="text-gray-700 leading-normal">
                      <span className="font-bold">{pub.authors}</span> ({pub.publication_date ? new Date(pub.publication_date).getFullYear() : ''}).{' '}
                      <span className="font-semibold text-gray-900">{pub.title}</span>.{' '}
                      {pub.journal && <span className="italic">. {pub.journal}</span>}
                      {pub.doi && <span className="text-gray-400"> DOI: {pub.doi}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {cvData.projects.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-bold text-[#1a3a5c] text-[11px] uppercase tracking-wider border-b border-gray-100 pb-1">
                  {language === 'pt' ? 'Projectos de Investigação' : 'Research Projects'}
                </h3>
                <div className="space-y-2">
                  {cvData.projects.map((proj: any) => (
                    <div key={proj.id} className="flex justify-between items-start gap-4">
                      <div>
                        <div className="font-bold text-gray-800">{proj.title}</div>
                        <div className="text-gray-500 text-[11px]">
                          {proj.role} {proj.funding_entity ? ` · Financiado por: ${proj.funding_entity}` : ''}
                        </div>
                      </div>
                      <div className="text-right shrink-0 text-gray-400 text-[10px] font-medium">
                        {proj.start_date ? new Date(proj.start_date).getFullYear() : ''} -{' '}
                        {proj.is_current ? 'Presente' : proj.end_date ? new Date(proj.end_date).getFullYear() : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {cvData.skills.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-bold text-[#1a3a5c] text-[11px] uppercase tracking-wider border-b border-gray-100 pb-1">
                  {language === 'pt' ? 'Competências' : 'Skills'}
                </h3>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-gray-600">
                  {cvData.skills.map((skill: any) => (
                    <span key={skill.id} className="inline-flex items-center gap-1">
                      <span className="font-medium text-gray-800">{skill.skill_name}</span>
                      {skill.proficiency_level && (
                        <span className="text-[9px] text-gray-400 font-semibold capitalize">({skill.proficiency_level})</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Awards */}
            {cvData.awards.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-bold text-[#1a3a5c] text-[11px] uppercase tracking-wider border-b border-gray-100 pb-1">
                  {language === 'pt' ? 'Prémios e Distinções' : 'Awards & Recognition'}
                </h3>
                <div className="space-y-1.5">
                  {cvData.awards.map((award: any) => (
                    <div key={award.id} className="flex justify-between items-start gap-4">
                      <div>
                        <span className="font-bold text-gray-800">{award.title}</span>
                        {award.issuer && <span className="text-gray-500"> ({award.issuer})</span>}
                      </div>
                      <div className="text-right shrink-0 text-gray-400 text-[10px] font-medium">
                        {award.award_date ? new Date(award.award_date).getFullYear() : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
