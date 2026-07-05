'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createCurriculum } from '@/lib/actions/cv'
import { Sparkles, FileText, ArrowRight, ArrowLeft, Check, Globe } from 'lucide-react'

interface NewCVClientProps {
  profileExists: boolean
  hasData: boolean
}

const templates = [
  { value: 'academic', label: 'Academic Classic', desc: 'Design tradicional centrado em publicações e docência. Ideal para universidades públicas angolanas.', icon: FileText, badge: 'Tradicional' },
  { value: 'research', label: 'Modern Research', desc: 'Foco em projectos financiados, laboratórios e métricas. Ideal para centros de investigação.', icon: FileText, badge: 'Moderno' },
  { value: 'minimal', label: 'Minimal Clean', desc: 'Layout simples, direto e de fácil leitura. Focado em investigadores seniores.', icon: FileText, badge: 'Minimalista' },
  { value: 'industry', label: 'Industry Pro', desc: 'Optimizado para parcerias com o sector privado e consultoria científica.', icon: FileText, badge: 'Corporativo' },
]

export default function NewCVClient({ profileExists, hasData }: NewCVClientProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [language, setLanguage] = useState('pt')
  const [template, setTemplate] = useState('academic')
  const [aiGenerate, setAiGenerate] = useState(hasData)

  async function handleCreate() {
    if (!title.trim()) return
    setLoading(true)
    try {
      let summary = ''
      if (aiGenerate) {
        // Tenta pré-gerar resumo profissional
        try {
          const response = await fetch('/api/ai/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'generate_summary',
              context: {
                full_name: 'Utilizador',
                bio: 'Perfil académico ativo na plataforma',
              },
            }),
          })
          const data = await response.json()
          if (data.text) summary = data.text
        } catch (e) {
          console.error('Erro ao gerar resumo inicial por IA:', e)
        }
      }

      const newCV = await createCurriculum({
        title,
        language,
        template_name: template as any,
        ai_generated: aiGenerate,
        summary: summary || null,
        is_public: false,
        is_default: false,
      })

      if (newCV?.id) {
        router.push(`/dashboard/cv/${newCV.id}`)
      }
    } catch (err: any) {
      alert('Erro ao criar currículo: ' + err.message)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl bg-white/80 border border-gray-100 rounded-3xl p-6 md:p-8 shadow-glass space-y-6">
      {/* Progress header */}
      <div className="flex items-center justify-between border-b border-gray-50 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center font-bold text-xs">
            {step}
          </div>
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
            Passo {step} de 2
          </span>
        </div>
        <div className="h-1.5 w-32 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-600 transition-all duration-300"
            style={{ width: `${step * 50}%` }}
          />
        </div>
      </div>

      {step === 1 ? (
        <div className="space-y-5 animate-slide-in">
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">Título e Configurações do Documento</h2>
            <p className="text-xs text-gray-500">Defina o nome do documento e o idioma de apresentação.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Título do Currículo
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ex: Candidatura Bolsa de Pós-Graduação 2026"
                className="input-field text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Idioma do Currículo
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setLanguage('pt')}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border text-sm font-semibold transition-all ${
                    language === 'pt'
                      ? 'border-brand-600 bg-brand-50/50 text-brand-700 font-bold'
                      : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  Português
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border text-sm font-semibold transition-all ${
                    language === 'en'
                      ? 'border-brand-600 bg-brand-50/50 text-brand-700 font-bold'
                      : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  Inglês (English)
                </button>
              </div>
            </div>

            {hasData && (
              <div className="flex items-start gap-3 p-4 bg-amber-50/40 border border-amber-100 rounded-2xl">
                <input
                  type="checkbox"
                  id="ai_generate"
                  checked={aiGenerate}
                  onChange={e => setAiGenerate(e.target.checked)}
                  className="rounded border-gray-300 text-brand-600 focus:ring-brand-500 h-4.5 w-4.5 mt-0.5"
                />
                <div>
                  <label htmlFor="ai_generate" className="text-xs font-bold text-gray-800 cursor-pointer flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                    Pré-gerar resumo profissional por IA
                  </label>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Com base no seu perfil, formações e experiências, a IA criará automaticamente um resumo otimizado para o documento.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setStep(2)}
              disabled={!title.trim()}
              className="btn-primary px-5 py-3 rounded-2xl text-xs flex items-center gap-1.5 disabled:opacity-50"
            >
              Escolher Layout <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-5 animate-slide-in">
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">Selecione o Template Visual</h2>
            <p className="text-xs text-gray-500">Escolha o modelo de design que melhor se adequa ao seu perfil e objectivos.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {templates.map(t => {
              const isSelected = template === t.value
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setTemplate(t.value)}
                  className={`flex flex-col text-left p-5 rounded-2xl border transition-all ${
                    isSelected
                      ? 'border-brand-600 bg-brand-50/30 ring-2 ring-brand-500/20'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                  }`}
                >
                  <div className="flex justify-between items-center w-full mb-2">
                    <span className="font-bold text-gray-900 text-sm">{t.label}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {t.badge}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed flex-1">
                    {t.desc}
                  </p>
                </button>
              )
            })}
          </div>

          <div className="flex justify-between pt-4 border-t border-gray-50">
            <button
              onClick={() => setStep(1)}
              className="btn-secondary px-4 py-3 rounded-2xl text-xs flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar
            </button>
            <button
              onClick={handleCreate}
              disabled={loading}
              className="btn-primary px-6 py-3 rounded-2xl text-xs flex items-center gap-1.5 shadow-brand"
            >
              {loading ? (
                'A Criar Currículo...'
              ) : (
                <>
                  Criar Currículo <Check className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
