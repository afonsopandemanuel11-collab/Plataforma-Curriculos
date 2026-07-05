'use client'

import { useState } from 'react'
import { upsertAward, deleteAward } from '@/lib/actions/cv'
import { Plus, Trash2, Edit2, Award, Calendar, Shield, X, Save } from 'lucide-react'

interface AwardItem {
  id: string
  title: string
  issuer?: string | null
  award_date?: string | null
  description?: string | null
}

interface AwardsClientProps {
  initialAwards: AwardItem[]
}

export default function AwardsClient({ initialAwards }: AwardsClientProps) {
  const [items, setItems] = useState<AwardItem[]>(initialAwards)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Partial<AwardItem> | null>(null)
  const [loading, setLoading] = useState(false)

  function handleOpenAdd() {
    setEditingItem({
      title: '',
      issuer: '',
      award_date: '',
      description: '',
    })
    setModalOpen(true)
  }

  function handleOpenEdit(item: AwardItem) {
    setEditingItem(item)
    setModalOpen(true)
  }

  async function handleDelete(id: string) {
    if (!confirm('Tens a certeza que queres eliminar este prémio?')) return
    try {
      await deleteAward(id)
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
    const payload = {
      id: editingItem.id,
      title: fd.get('title') as string,
      issuer: fd.get('issuer') as string || null,
      award_date: fd.get('award_date') as string || null,
      description: fd.get('description') as string || null,
    }

    try {
      await upsertAward(payload)
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
          <Award className="w-5 h-5 text-brand-600" /> Prémios Registados
        </h2>
        <button
          onClick={handleOpenAdd}
          className="btn-primary px-4 py-2 rounded-xl text-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Adicionar Prémio
        </button>
      </div>

      {/* Grid of cards */}
      {!items.length ? (
        <div className="bg-white/80 border border-gray-100 rounded-3xl p-10 text-center shadow-card">
          <Award className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <h3 className="text-md font-bold text-gray-700 mb-1">Sem prémios ou distinções</h3>
          <p className="text-xs text-gray-400 max-w-xs mx-auto mb-4">
            Registe bolsas de estudo, prémios científicos, distinções de excelência ou reconhecimento académico.
          </p>
          <button onClick={handleOpenAdd} className="btn-secondary text-xs rounded-xl px-4 py-2">
            Adicionar prémio
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
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-1.5 shrink-0">
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
                  {item.issuer && (
                    <div className="flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-gray-400" />
                      <span>Emitido por: {item.issuer}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>
                      Data:{' '}
                      {item.award_date
                        ? new Date(item.award_date).toLocaleDateString('pt-PT', { year: 'numeric', month: 'long' })
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
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-glass border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 bg-[#1a3a5c] text-white flex justify-between items-center shrink-0">
              <h3 className="font-bold text-md flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                {editingItem.id ? 'Editar Prémio / Bolsa' : 'Adicionar Prémio / Bolsa'}
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
                  Título do Prémio / Nome da Bolsa
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={editingItem.title}
                  placeholder="Ex: Melhor Investigador Jovem, Bolsa FCT"
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Entidade Emissora
                </label>
                <input
                  type="text"
                  name="issuer"
                  defaultValue={editingItem.issuer ?? ''}
                  placeholder="Ex: Fundação Calouste Gulbenkian"
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Data da Atribuição
                </label>
                <input
                  type="date"
                  name="award_date"
                  defaultValue={editingItem.award_date ?? ''}
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Descrição (Opcional)
                </label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={editingItem.description ?? ''}
                  placeholder="Descreva sumariamente o motivo do prémio ou objectivos da bolsa..."
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
