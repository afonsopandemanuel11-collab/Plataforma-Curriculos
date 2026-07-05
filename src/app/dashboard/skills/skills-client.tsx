'use client'

import { useState } from 'react'
import { upsertSkill, deleteSkill } from '@/lib/actions/cv'
import { Plus, Trash2, Edit2, Brain, Sparkles, X, Save, Check } from 'lucide-react'

interface SkillItem {
  id: string
  skill_name: string
  category?: string | null
  proficiency_level?: 'basico' | 'intermediario' | 'avancado' | 'especialista' | null
}

interface SkillsClientProps {
  initialSkills: SkillItem[]
}

const proficiencyLevels = [
  { value: 'basico', label: 'Básico (Basic)' },
  { value: 'intermediario', label: 'Intermédio (Intermediate)' },
  { value: 'avancado', label: 'Avançado (Advanced)' },
  { value: 'especialista', label: 'Especialista (Expert)' },
]

export default function SkillsClient({ initialSkills }: SkillsClientProps) {
  const [items, setItems] = useState<SkillItem[]>(initialSkills)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Partial<SkillItem> | null>(null)
  const [loading, setLoading] = useState(false)

  // AI Suggestions state
  const [aiSuggestions, setAiSuggestions] = useState<{ skill_name: string; category: string }[]>([])
  const [aiLoading, setAiLoading] = useState(false)
  const [aiField, setAiField] = useState('')

  function handleOpenAdd() {
    setEditingItem({
      skill_name: '',
      category: '',
      proficiency_level: 'intermediario',
    })
    setModalOpen(true)
  }

  function handleOpenEdit(item: SkillItem) {
    setEditingItem(item)
    setModalOpen(true)
  }

  async function handleDelete(id: string) {
    if (!confirm('Tens a certeza que queres eliminar esta competência?')) return
    try {
      await deleteSkill(id)
      setItems(items.filter(item => item.id !== id))
    } catch (err: any) {
      alert('Erro ao eliminar: ' + err.message)
    }
  }

  async function handleGetSuggestions() {
    if (!aiField.trim()) return
    setAiLoading(true)
    setAiSuggestions([])
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'suggest_skills',
          context: { field: aiField },
        }),
      })
      const data = await response.json()
      if (data.error) throw new Error(data.error)
      if (data.text) {
        // Tenta fazer parse do JSON recebido
        let cleanedText = data.text.trim()
        // Remove markdown tags ```json se houver
        if (cleanedText.startsWith('```')) {
          cleanedText = cleanedText.replace(/^```(json)?/, '').replace(/```$/, '').trim()
        }
        const parsed = JSON.parse(cleanedText)
        if (Array.isArray(parsed)) {
          setAiSuggestions(parsed)
        }
      }
    } catch (err: any) {
      alert('Erro ao sugerir competências: ' + err.message)
    } finally {
      setAiLoading(false)
    }
  }

  async function handleAddSuggested(sug: { skill_name: string; category: string }) {
    setLoading(true)
    try {
      const payload = {
        skill_name: sug.skill_name,
        category: sug.category,
        proficiency_level: 'intermediario' as const,
      }
      await upsertSkill(payload)
      window.location.reload()
    } catch (err: any) {
      alert('Erro ao adicionar competência sugerida: ' + err.message)
      setLoading(false)
    }
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!editingItem) return
    setLoading(true)

    const fd = new FormData(e.currentTarget)
    const payload = {
      id: editingItem.id,
      skill_name: fd.get('skill_name') as string,
      category: fd.get('category') as string || null,
      proficiency_level: (fd.get('proficiency_level') as any) || null,
    }

    try {
      await upsertSkill(payload)
      window.location.reload()
    } catch (err: any) {
      alert('Erro ao guardar: ' + err.message)
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header action */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Brain className="w-5 h-5 text-brand-600" /> Competências Registadas
        </h2>
        <button
          onClick={handleOpenAdd}
          className="btn-primary px-4 py-2 rounded-xl text-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Adicionar Competência
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Side: Skills list */}
        <div className="lg:col-span-2 space-y-4">
          {!items.length ? (
            <div className="bg-white/80 border border-gray-100 rounded-3xl p-10 text-center shadow-card">
              <Brain className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <h3 className="text-md font-bold text-gray-700 mb-1">Sem competências</h3>
              <p className="text-xs text-gray-400 max-w-xs mx-auto mb-4">
                Registe competências técnicas (Python, R, Escrita Científica, Metodologias) para demonstrar a sua capacitação.
              </p>
              <button onClick={handleOpenAdd} className="btn-secondary text-xs rounded-xl px-4 py-2">
                Adicionar competência
              </button>
            </div>
          ) : (
            <div className="bg-white/80 border border-gray-100 rounded-3xl p-6 shadow-card space-y-6">
              {/* Group by category */}
              {Array.from(new Set(items.map(item => item.category || 'Geral'))).map(category => (
                <div key={category} className="space-y-3">
                  <h4 className="text-xs font-bold text-[#1a3a5c] uppercase tracking-wider border-b border-gray-50 pb-1.5">
                    {category}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {items
                      .filter(item => (item.category || 'Geral') === category)
                      .map(item => (
                        <div
                          key={item.id}
                          className="inline-flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-1.5 text-xs text-gray-700"
                        >
                          <span className="font-semibold">{item.skill_name}</span>
                          {item.proficiency_level && (
                            <span className="text-[10px] text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded-md font-medium capitalize">
                              {item.proficiency_level}
                            </span>
                          )}
                          <div className="flex items-center gap-0.5 border-l border-gray-200 pl-1.5 ml-1">
                            <button
                              onClick={() => handleOpenEdit(item)}
                              className="text-gray-400 hover:text-gray-900 transition-colors"
                              title="Editar"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-gray-400 hover:text-red-600 transition-colors pl-1"
                              title="Eliminar"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: AI Suggestions */}
        <div className="bg-white/80 border border-gray-100 rounded-3xl p-6 shadow-card space-y-4 h-fit">
          <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1.5 border-b border-gray-50 pb-2">
            <Sparkles className="w-4 h-4 text-amber-500" /> Sugestões por IA (Gemini)
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Escreva a sua área científica (ex: Epidemiologia, Ciências de Dados) para obter sugestões automáticas de competências relevantes.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={aiField}
              onChange={e => setAiField(e.target.value)}
              placeholder="Ex: Física Teórica, Química Orgânica"
              className="input-field text-xs py-2 px-3 flex-1"
            />
            <button
              onClick={handleGetSuggestions}
              disabled={aiLoading || !aiField.trim()}
              className="btn-primary text-xs py-2 px-3 rounded-xl flex items-center gap-1 shrink-0"
            >
              {aiLoading ? '...' : 'Sugerir'}
            </button>
          </div>

          {aiSuggestions.length > 0 && (
            <div className="space-y-2.5 pt-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
              {aiSuggestions.map((sug, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-3 bg-gray-50 border border-gray-100 rounded-xl p-2.5 hover:bg-gray-100/50 transition-colors"
                >
                  <div>
                    <div className="text-xs font-bold text-gray-800">{sug.skill_name}</div>
                    <div className="text-[10px] text-gray-400 font-medium capitalize mt-0.5">{sug.category}</div>
                  </div>
                  <button
                    onClick={() => handleAddSuggested(sug)}
                    className="p-1 bg-white border border-gray-100 hover:bg-brand-50 hover:text-brand-700 rounded-lg text-gray-500 transition-all shrink-0"
                    title="Adicionar"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Insert/Edit Modal */}
      {modalOpen && editingItem && (
        <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-glass border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 bg-[#1a3a5c] text-white flex justify-between items-center shrink-0">
              <h3 className="font-bold text-md flex items-center gap-2">
                <Brain className="w-5 h-5 text-amber-400" />
                {editingItem.id ? 'Editar Competência' : 'Adicionar Competência'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Nome da Competência
                </label>
                <input
                  type="text"
                  name="skill_name"
                  required
                  defaultValue={editingItem.skill_name}
                  placeholder="Ex: Análise Estatística, SPSS, Python"
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Categoria / Grupo
                </label>
                <input
                  type="text"
                  name="category"
                  defaultValue={editingItem.category ?? ''}
                  placeholder="Ex: Metodologias, Programação, Idiomas"
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Nível de Proficiência
                </label>
                <select
                  name="proficiency_level"
                  defaultValue={editingItem.proficiency_level ?? 'intermediario'}
                  className="input-field text-sm"
                >
                  {proficiencyLevels.map(lvl => (
                    <option key={lvl.value} value={lvl.value}>
                      {lvl.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-secondary px-4 py-2 rounded-xl text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary px-5 py-2 rounded-xl text-xs flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" /> Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
