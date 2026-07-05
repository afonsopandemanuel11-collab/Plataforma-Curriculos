'use client'

import { useState } from 'react'
import { upsertEducation, deleteEducation } from '@/lib/actions/cv'
import { Plus, Trash2, Edit2, GraduationCap, Calendar, Award, School, X, Save } from 'lucide-react'

interface EducationItem {
  id: string
  institution: string
  degree: string
  field_of_study?: string | null
  start_date?: string | null
  end_date?: string | null
  is_current: boolean
  grade?: string | null
  description?: string | null
}

interface EducationClientProps {
  initialEducation: EducationItem[]
}

export default function EducationClient({ initialEducation }: EducationClientProps) {
  const [items, setItems] = useState<EducationItem[]>(initialEducation)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Partial<EducationItem> | null>(null)
  const [loading, setLoading] = useState(false)

  function handleOpenAdd() {
    setEditingItem({
      institution: '',
      degree: '',
      field_of_study: '',
      start_date: '',
      end_date: '',
      is_current: false,
      grade: '',
      description: '',
    })
    setModalOpen(true)
  }

  function handleOpenEdit(item: EducationItem) {
    setEditingItem(item)
    setModalOpen(true)
  }

  async function handleDelete(id: string) {
    if (!confirm('Tens a certeza que queres eliminar esta formação?')) return
    try {
      await deleteEducation(id)
      setItems(items.filter(item => item.id !== id))
    } catch (err: any) {
      alert('Erro ao eliminar: ' + err.message)
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
      institution: fd.get('institution') as string,
      degree: fd.get('degree') as string,
      field_of_study: fd.get('field_of_study') as string || null,
      start_date: fd.get('start_date') as string || null,
      end_date: isCurrent ? null : (fd.get('end_date') as string || null),
      is_current: isCurrent,
      grade: fd.get('grade') as string || null,
      description: fd.get('description') as string || null,
    }

    try {
      await upsertEducation(payload)
      // Recarrega a página ou atualiza o estado localmente. Para simplificar, vamos recarregar o estado
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
          <GraduationCap className="w-5 h-5 text-brand-600" /> Formações Registadas
        </h2>
        <button
          onClick={handleOpenAdd}
          className="btn-primary px-4 py-2 rounded-xl text-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Adicionar Formação
        </button>
      </div>

      {/* Grid of cards */}
      {!items.length ? (
        <div className="bg-white/80 border border-gray-100 rounded-3xl p-10 text-center shadow-card">
          <GraduationCap className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <h3 className="text-md font-bold text-gray-700 mb-1">Sem formação académica</h3>
          <p className="text-xs text-gray-400 max-w-xs mx-auto mb-4">
            Adicione os seus graus académicos (Licenciatura, Mestrado, Doutoramento) para aparecerem no currículo.
          </p>
          <button onClick={handleOpenAdd} className="btn-secondary text-xs rounded-xl px-4 py-2">
            Adicionar formação
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
                    {item.degree} em {item.field_of_study ?? 'Geral'}
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
                    <School className="w-3.5 h-3.5 text-gray-400" />
                    <span>{item.institution}</span>
                  </div>
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
                  {item.grade && (
                    <div className="flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-gray-400" />
                      <span>Classificação: {item.grade}</span>
                    </div>
                  )}
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
                <GraduationCap className="w-5 h-5 text-amber-400" />
                {editingItem.id ? 'Editar Formação' : 'Adicionar Formação'}
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
                  Grau Académico / Diploma
                </label>
                <input
                  type="text"
                  name="degree"
                  required
                  defaultValue={editingItem.degree}
                  placeholder="Ex: Licenciatura, Mestrado, Doutoramento"
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Área de Estudo / Curso
                </label>
                <input
                  type="text"
                  name="field_of_study"
                  defaultValue={editingItem.field_of_study ?? ''}
                  placeholder="Ex: Engenharia Informática, Biologia"
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Instituição de Ensino
                </label>
                <input
                  type="text"
                  name="institution"
                  required
                  defaultValue={editingItem.institution}
                  placeholder="Ex: Universidade Agostinho Neto"
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
                    Data de Conclusão
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
                  Ainda a frequentar este curso
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Classificação Final / Nota (Opcional)
                </label>
                <input
                  type="text"
                  name="grade"
                  defaultValue={editingItem.grade ?? ''}
                  placeholder="Ex: 16 Valores, Cum Laude"
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Descrição / Detalhes (Opcional)
                </label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={editingItem.description ?? ''}
                  placeholder="Ex: Tese de licenciatura focada no tema..."
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
