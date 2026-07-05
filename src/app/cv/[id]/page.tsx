import { getCurriculumById, getFullCVDataByUserId } from '@/lib/actions/cv'
import { getUser } from '@/lib/actions/auth'
import { prisma } from '@/lib/db'
import { notFound, redirect } from 'next/navigation'
import PrintHelper from './print-helper'
import CVToolbar from './cv-toolbar'
import { FileText, Globe, School, Mail, Phone, MapPin, Link2 } from 'lucide-react'
import Link from 'next/link'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cv = await getCurriculumById(id)
  return {
    title: cv ? `${cv.title} | CurriculumAI` : 'Currículo Académico',
    description: cv?.summary || 'Currículo Académico gerado no CurriculumAI',
  }
}

export default async function PublicCVPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { id } = await params
  const sParams = await searchParams
  const isPrintMode = sParams.print === 'true'

  // Busca o currículo
  const cv = await getCurriculumById(id)
  if (!cv) notFound()

  // Valida visibilidade
  const user = await getUser()

  const isOwner = user && cv.userId === user.id

  if (!cv.isPublic && !isOwner) {
    // Redireciona para o login se não for público e não for o proprietário
    redirect('/auth/login')
  }

  // Incrementa contagem de visualizações se não for o proprietário
  if (!isOwner) {
    try {
      await prisma.curriculum.update({
        where: { id: cv.id },
        data: { viewCount: cv.viewCount + 1 },
      })
    } catch (e) {
      console.error('Erro ao incrementar visualizações:', e)
    }
  }

  // Carrega dados
  const cvData = await getFullCVDataByUserId(cv.userId)

  const template = cv.template_name // academic, research, minimal, industry
  const language = cv.language // pt, en

  // Definição de fontes com base no template
  const fontClass = template === 'academic' ? 'font-serif' : 'font-sans'

  return (
    <div className={`min-h-screen bg-gray-100 ${isPrintMode ? 'py-0 bg-white' : 'py-10'} print:py-0 print:bg-white`}>
      <PrintHelper />

      {/* Print-specific style block for margin configuration */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body {
            background-color: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          .print-container {
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
          @page {
            size: A4;
            margin: 1.5cm;
          }
        }
      `}} />

      {/* Floating control bar (hidden in print) */}
      {!isPrintMode && (
        <CVToolbar
          title={cv.title}
          language={language}
          cvId={cv.id}
          isOwner={!!isOwner}
        />
      )}

      {/* A4 Sheet Container */}
      <div className={`print-container max-w-4xl mx-auto bg-white shadow-glass border border-gray-100 p-8 md:p-12 rounded-3xl ${fontClass} text-gray-800`}>
        {/* CV HEADER */}
        <div className="text-center space-y-2 pb-6 border-b border-gray-200">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">{cvData.profile?.full_name}</h1>
          {cvData.profile?.academic_level && (
            <p className="text-xs font-bold text-brand-700 uppercase tracking-widest">
              {cvData.profile.academic_level.replace('_', ' ')}
              {cvData.profile.institution ? ` · ${cvData.profile.institution}` : ''}
            </p>
          )}
          
          {/* Metadata Icons Grid */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-gray-500 font-medium pt-2">
            {cvData.profile?.email && (
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-gray-400" /> {cvData.profile.email}
              </span>
            )}
            {cvData.profile?.phone && (
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-gray-400" /> {cvData.profile.phone}
              </span>
            )}
            {cvData.profile?.nationality && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-gray-400" /> {cvData.profile.nationality}
              </span>
            )}
            {cvData.profile?.orcid_id && (
              <span className="flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-brand-600" /> ORCID: {cvData.profile.orcid_id}
              </span>
            )}
          </div>
        </div>

        {/* CV CONTENT */}
        <div className="space-y-6 pt-6 text-xs md:text-sm">
          {/* Summary / Biography */}
          {cv.summary && (
            <div className="space-y-2">
              <h2 className="text-sm font-bold text-[#1a3a5c] uppercase tracking-wider border-b border-gray-150 pb-1">
                {language === 'pt' ? 'Resumo Profissional' : 'Professional Summary'}
              </h2>
              <p className="leading-relaxed text-gray-600 text-justify">{cv.summary}</p>
            </div>
          )}

          {/* Education */}
          {cvData.education.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-[#1a3a5c] uppercase tracking-wider border-b border-gray-155 pb-1">
                {language === 'pt' ? 'Formação Académica' : 'Education'}
              </h2>
              <div className="space-y-3">
                {cvData.education.map((edu: any) => (
                  <div key={edu.id} className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <div className="font-bold text-gray-900 text-sm">
                        {edu.degree} em {edu.field_of_study}
                      </div>
                      <div className="text-gray-500 font-medium flex items-center gap-1">
                        <School className="w-3.5 h-3.5 text-gray-400" /> {edu.institution}
                      </div>
                      {edu.description && (
                        <p className="text-xs text-gray-400 leading-relaxed mt-1">{edu.description}</p>
                      )}
                    </div>
                    <div className="text-right shrink-0 text-gray-400 text-xs font-semibold whitespace-nowrap">
                      {edu.start_date ? new Date(edu.start_date).getFullYear() : ''} -{' '}
                      {edu.is_current ? (language === 'pt' ? 'Presente' : 'Present') : edu.end_date ? new Date(edu.end_date).getFullYear() : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {cvData.experiences.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-[#1a3a5c] uppercase tracking-wider border-b border-gray-155 pb-1">
                {language === 'pt' ? 'Experiência Profissional' : 'Professional Experience'}
              </h2>
              <div className="space-y-4">
                {cvData.experiences.map((exp: any) => (
                  <div key={exp.id} className="space-y-1">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <div className="font-bold text-gray-900 text-sm">{exp.role}</div>
                        <div className="text-gray-500 font-medium">{exp.organization}</div>
                      </div>
                      <div className="text-right shrink-0 text-gray-400 text-xs font-semibold whitespace-nowrap">
                        {exp.start_date ? new Date(exp.start_date).getFullYear() : ''} -{' '}
                        {exp.is_current ? (language === 'pt' ? 'Presente' : 'Present') : exp.end_date ? new Date(exp.end_date).getFullYear() : ''}
                      </div>
                    </div>
                    {exp.description && (
                      <p className="text-gray-600 text-xs leading-relaxed text-justify mt-1.5 pl-3 border-l-2 border-gray-100">
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
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-[#1a3a5c] uppercase tracking-wider border-b border-gray-155 pb-1">
                {language === 'pt' ? 'Publicações Científicas' : 'Scientific Publications'}
              </h2>
              <div className="space-y-2">
                {cvData.publications.map((pub: any) => (
                  <div key={pub.id} className="text-gray-700 leading-normal text-xs md:text-sm">
                    <span className="font-bold text-gray-900">{pub.authors}</span> ({pub.publication_date ? new Date(pub.publication_date).getFullYear() : ''}).{' '}
                    <span className="font-semibold text-gray-900">{pub.title}</span>.{' '}
                    {pub.journal && <span className="italic">. {pub.journal}</span>}
                    {pub.doi && <span className="text-brand-600"> DOI: {pub.doi}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {cvData.projects.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-[#1a3a5c] uppercase tracking-wider border-b border-gray-155 pb-1">
                {language === 'pt' ? 'Projectos de Investigação' : 'Research Projects'}
              </h2>
              <div className="space-y-3">
                {cvData.projects.map((proj: any) => (
                  <div key={proj.id} className="flex justify-between items-start gap-4">
                    <div>
                      <div className="font-bold text-gray-900">{proj.title}</div>
                      <div className="text-gray-500 text-xs">
                        {proj.role} {proj.funding_entity ? ` · Financiador: ${proj.funding_entity}` : ''}
                        {proj.budget !== null && proj.budget !== undefined && ` · Orçamento: ${proj.budget.toLocaleString('pt-PT')} AOA`}
                      </div>
                      {proj.description && (
                        <p className="text-xs text-gray-400 mt-1 leading-relaxed">{proj.description}</p>
                      )}
                    </div>
                    <div className="text-right shrink-0 text-gray-400 text-xs font-semibold whitespace-nowrap">
                      {proj.start_date ? new Date(proj.start_date).getFullYear() : ''} -{' '}
                      {proj.is_current ? (language === 'pt' ? 'Presente' : 'Present') : proj.end_date ? new Date(proj.end_date).getFullYear() : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {cvData.certifications.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-[#1a3a5c] uppercase tracking-wider border-b border-gray-155 pb-1">
                {language === 'pt' ? 'Certificações' : 'Certifications'}
              </h2>
              <div className="grid md:grid-cols-2 gap-3">
                {cvData.certifications.map((cert: any) => (
                  <div key={cert.id} className="bg-gray-50/40 rounded-xl p-3 border border-gray-100 flex flex-col justify-between">
                    <div>
                      <div className="font-bold text-gray-900 text-xs">{cert.name}</div>
                      <div className="text-gray-500 text-[11px] mt-0.5">{cert.issuing_organization}</div>
                    </div>
                    <div className="text-[10px] text-gray-400 font-semibold mt-2">
                      Emitido:{' '}
                      {cert.issue_date
                        ? new Date(cert.issue_date).toLocaleDateString('pt-PT', { year: 'numeric', month: 'short' })
                        : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {cvData.skills.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-[#1a3a5c] uppercase tracking-wider border-b border-gray-155 pb-1">
                {language === 'pt' ? 'Competências' : 'Skills'}
              </h2>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-gray-700 text-xs">
                {cvData.skills.map((skill: any) => (
                  <span key={skill.id} className="inline-flex items-center gap-1 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg">
                    <span className="font-medium text-gray-900">{skill.skill_name}</span>
                    {skill.proficiency_level && (
                      <span className="text-[9px] text-gray-400 font-bold capitalize">({skill.proficiency_level})</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Awards */}
          {cvData.awards.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-[#1a3a5c] uppercase tracking-wider border-b border-gray-155 pb-1">
                {language === 'pt' ? 'Prémios e Bolsas' : 'Awards & Recognition'}
              </h2>
              <div className="space-y-2">
                {cvData.awards.map((award: any) => (
                  <div key={award.id} className="flex justify-between items-start gap-4">
                    <div>
                      <span className="font-bold text-gray-900">{award.title}</span>
                      {award.issuer && <span className="text-gray-500"> ({award.issuer})</span>}
                      {award.description && (
                        <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{award.description}</p>
                      )}
                    </div>
                    <div className="text-right shrink-0 text-gray-400 text-xs font-semibold whitespace-nowrap">
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
  )
}
