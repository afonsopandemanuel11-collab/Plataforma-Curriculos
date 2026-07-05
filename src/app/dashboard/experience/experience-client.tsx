'use client'

import { useState } from 'react'
import { upsertExperience, deleteExperience } from '@/lib/actions/cv'
import { Plus, Trash2, Edit2, Briefcase, Calendar, MapPin, X, Save, Sparkles } from 'lucide-react'

interface ExperienceItem {
  id: string
  organization: string
  role: string
  location?: string | null
  start_date?: string | null
  end_date?: string | null
  is_current: boolean
  description?: string | null
}

interface ExperienceClientProps {
  initialExperiences: ExperienceItem[]
}

export default function ExperienceClient({ initialExperiences }: ExperienceClientProps) {
  const [items, setItems] = useState<ExperienceItem[]>(initialExperiences)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Partial<ExperienceItem> | null>(null)
  const [loading, setLoading] = useState(false)
  
  // IA State
  const [description, setDescription] = useState('')
  const [iaLoading, setIaLoading] = useState(false)

  function handleOpenAdd() {
    setDescription('')
    setEditingItem({
      organization: '',
      role: '',
      location: '',
      start_date: '',
      end_date: '',
      is_current: false,
      description: '',
    })
    setModalOpen(true)
  }

  function handleOpenEdit(item: ExperienceItem) {
    setDescription(item.description ?? '')
    setEditingItem(item)
    setModalOpen(true)
  }

  async function handleDelete(id: string) {
    if (!confirm('Tens a certeza que queres eliminar esta experiência?')) return
    try {
      await deleteExperience(id)
      setItems(items.filter(item => item.id !== id))
    } catch (err: any) {
      alert('Erro ao eliminar: ' + err.message)
    }
  }

  async function handleImproveDescription() {
    if (!description.trim()) return
    setIaLoading(true)
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'improve_text',
          context: { text: description },
        }),
      })
      const data = await response.json()
      if (data.error) throw new Error(data.error)
      if (data.text) {
        setDescription(data.text)
      }
    } catch (err: any) {
      alert('Erro ao otimizar descrição: ' + err.message)
    } finally {
      setIaLoading(false)
    }
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!editingItem) return
    setLoading(true)

    const fd = new FormData(e.currentTarget)
    const isCurrent = fd.get('is_current') === 'on'

    const payload = {
      id: editingItem.id,
      organization: fd.get('organization') as string,
      role: fd.get('role') as string,
      location: fd.get('location') as string || null,
      start_date: fd.get('start_date') as string || null,
      end_date: isCurrent ? null : (fd.get('end_date') as string || null),
      is_current: isCurrent,
      description: description || null,
    }

    try {
      await upsertExperience(payload)
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
          <Briefcase className="w-5 h-5 text-brand-600" /> Experiências Registadas
        </h2>
        <button
          onClick={handleOpenAdd}
          className="btn-primary px-4 py-2 rounded-xl text-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Adicionar Experiência
        </button>
      </div>

      {/* Grid of cards */}
      {!items.length ? (
        <div className="bg-white/80 border border-gray-100 rounded-3xl p-10 text-center shadow-card">
          <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <h3 className="text-md font-bold text-gray-700 mb-1">Sem experiência profissional</h3>
          <p className="text-xs text-gray-400 max-w-xs mx-auto mb-4">
            Registe a sua carreira académica ou profissional (Ex: Docente, Investigador, Consultor) para aparecer no currículo.
          </p>
          <button onClick={handleOpenAdd} className="btn-secondary text-xs rounded-xl px-4 py-2">
            Adicionar experiência
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {items.map(item => (
            <div
              key={item.id}
              className="bg-white/80 border border-gray-100 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h4 className="font-bold text-gray-900 leading-tight">
                    {item.role}
                  </h4>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-900 transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 hover:bg-red-50 rounded-lg text-gray-500 hover:text-red-600 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-gray-500 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                    <span>{item.organization}</span>
                  </div>
                  {item.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span>{item.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>
                      {item.start_date ? new Date(item.start_date).getFullYear() : 'N/D'} -{' '}
                      {item.is_current
                        ? 'Presente'
                        : item.end_date
                        ? new Date(item.end_date).getFullYear()
                        : 'N/D'}
                    </span>
                  </div>
                </div>

                {item.description && (
                  <p className="text-xs text-gray-400 mt-3 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Insert/Edit Modal */}
      {modalOpen && editingItem && (
        <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-glass border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 bg-[#1a3a5c] text-white flex justify-between items-center shrink-0">
              <h3 className="font-bold text-md flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-amber-400" />
                {editingItem.id ? 'Editar Experiência' : 'Adicionar Experiência'}
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
                  Cargo / Função
                </label>
                <input
                  type="text"
                  name="role"
                  required
                  defaultValue={editingItem.role}
                  placeholder="Ex: Professor Auxiliar, Investigador Principal"
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Organização / Faculdade / Empresa
                </label>
                <input
                  type="text"
                  name="organization"
                  required
                  defaultValue={editingItem.organization}
                  placeholder="Ex: Universidade Agostinho Neto"
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Localização (Opcional)
                </label>
                <input
                  type="text"
                  name="location"
                  defaultValue={editingItem.location ?? ''}
                  placeholder="Ex: Luanda, Angola"
                  className="input-field text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Data de Início
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    defaultValue={editingItem.start_date ?? ''}
                    className="input-field text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Data de Fim
                  </label>
                  <input
                    type="date"
                    name="end_date"
                    defaultValue={editingItem.end_date ?? ''}
                    disabled={editingItem.is_current}
                    className="input-field text-sm disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  name="is_current"
                  id="is_current"
                  defaultChecked={editingItem.is_current}
                  onChange={e =>
                    setEditingItem({ ...editingItem, is_current: e.target.checked })
                  }
                  className="rounded border-gray-300 text-brand-600 focus:ring-brand-500 h-4 w-4"
                />
                <label htmlFor="is_current" className="text-xs text-gray-600 font-medium">
                  Ainda a desempenhar esta função
                </label>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Descrição de Funções e Conquistas
                  </label>
                  <button
                    type="button"
                    onClick={handleImproveDescription}
                    disabled={iaLoading || !description.trim()}
                    className="text-[10px] bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold px-2 py-1 rounded-md flex items-center gap-1 transition-colors disabled:opacity-50"
                  >
                    {iaLoading ? 'A otimizar...' : <><Sparkles className="w-3 h-3 text-amber-500" /> Melhorar com IA</>}
                  </button>
                </div>
                <textarea
                  name="description"
                  rows={4}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Ex: Leccionação de cadeiras de Inteligência Artificial, supervisão de projectos de fim de curso e publicação de..."
                  className="input-field text-sm resize-none"
                />
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
