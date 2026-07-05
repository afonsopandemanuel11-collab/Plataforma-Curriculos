'use client'

import { useState } from 'react'
import { upsertProject, deleteProject } from '@/lib/actions/cv'
import { Plus, Trash2, Edit2, FolderGit2, Calendar, Link as LinkIcon, DollarSign, X, Save } from 'lucide-react'

interface ProjectItem {
  id: string
  title: string
  description?: string | null
  role?: string | null
  start_date?: string | null
  end_date?: string | null
  is_current: boolean
  funding_entity?: string | null
  budget?: number | null
  url?: string | null
}

interface ProjectsClientProps {
  initialProjects: ProjectItem[]
}

export default function ProjectsClient({ initialProjects }: ProjectsClientProps) {
  const [items, setItems] = useState<ProjectItem[]>(initialProjects)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Partial<ProjectItem> | null>(null)
  const [loading, setLoading] = useState(false)

  function handleOpenAdd() {
    setEditingItem({
      title: '',
      description: '',
      role: '',
      start_date: '',
      end_date: '',
      is_current: false,
      funding_entity: '',
      budget: null,
      url: '',
    })
    setModalOpen(true)
  }

  function handleOpenEdit(item: ProjectItem) {
    setEditingItem(item)
    setModalOpen(true)
  }

  async function handleDelete(id: string) {
    if (!confirm('Tens a certeza que queres eliminar este projecto?')) return
    try {
      await deleteProject(id)
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
    const budgetRaw = fd.get('budget') as string

    const payload = {
      id: editingItem.id,
      title: fd.get('title') as string,
      description: fd.get('description') as string || null,
      role: fd.get('role') as string || null,
      start_date: fd.get('start_date') as string || null,
      end_date: isCurrent ? null : (fd.get('end_date') as string || null),
      is_current: isCurrent,
      funding_entity: fd.get('funding_entity') as string || null,
      budget: budgetRaw ? parseFloat(budgetRaw) : null,
      url: fd.get('url') as string || null,
    }

    try {
      await upsertProject(payload)
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
          <FolderGit2 className="w-5 h-5 text-brand-600" /> Projectos Registados
        </h2>
        <button
          onClick={handleOpenAdd}
          className="btn-primary px-4 py-2 rounded-xl text-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Adicionar Projecto
        </button>
      </div>

      {/* Grid of cards */}
      {!items.length ? (
        <div className="bg-white/80 border border-gray-100 rounded-3xl p-10 text-center shadow-card">
          <FolderGit2 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <h3 className="text-md font-bold text-gray-700 mb-1">Sem projectos de investigação</h3>
          <p className="text-xs text-gray-400 max-w-xs mx-auto mb-4">
            Registe os seus projectos financiados, iniciativas científicas e trabalhos de investigação ativa.
          </p>
          <button onClick={handleOpenAdd} className="btn-secondary text-xs rounded-xl px-4 py-2">
            Adicionar projecto
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
                  <h4 className="font-bold text-gray-900 leading-tight text-sm">
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
                  {item.role && (
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-gray-700">Função:</span>
                      <span>{item.role}</span>
                    </div>
                  )}
                  {item.funding_entity && (
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-gray-700">Financiador:</span>
                      <span>{item.funding_entity}</span>
                    </div>
                  )}
                  {item.budget !== null && item.budget !== undefined && (
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                      <span>Orçamento: {item.budget.toLocaleString('pt-PT')} AOA</span>
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
                  {item.url && (
                    <div className="flex items-center gap-1.5">
                      <LinkIcon className="w-3.5 h-3.5 text-gray-400" />
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">
                        Ver Link
                      </a>
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
                <FolderGit2 className="w-5 h-5 text-amber-400" />
                {editingItem.id ? 'Editar Projecto' : 'Adicionar Projecto'}
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
                  Título do Projecto
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={editingItem.title}
                  placeholder="Ex: Desenvolvimento de Vacinas Locais contra Malária"
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Função no Projecto (Opcional)
                </label>
                <input
                  type="text"
                  name="role"
                  defaultValue={editingItem.role ?? ''}
                  placeholder="Ex: Investigador Principal, Coordenador, Bolseiro"
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Entidade Financiadora / Patrocinador
                </label>
                <input
                  type="text"
                  name="funding_entity"
                  defaultValue={editingItem.funding_entity ?? ''}
                  placeholder="Ex: Ministério do Ensino Superior, Ciência, Tecnologia e Inovação"
                  className="input-field text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Orçamento (AOA)
                  </label>
                  <input
                    type="number"
                    name="budget"
                    step="0.01"
                    defaultValue={editingItem.budget ?? ''}
                    placeholder="Ex: 5000000"
                    className="input-field text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Website do Projecto
                  </label>
                  <input
                    type="url"
                    name="url"
                    defaultValue={editingItem.url ?? ''}
                    placeholder="https://..."
                    className="input-field text-sm"
                  />
                </div>
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
                  Projecto em execução ativa
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Descrição do Projecto
                </label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={editingItem.description ?? ''}
                  placeholder="Descreva sumariamente os objectivos, metodologia e resultados esperados..."
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
