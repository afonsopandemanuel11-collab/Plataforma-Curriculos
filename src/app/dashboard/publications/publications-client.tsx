'use client'

import { useState } from 'react'
import { upsertPublication, deletePublication } from '@/lib/actions/cv'
import { Plus, Trash2, Edit2, FileText, Calendar, Link as LinkIcon, User, X, Save } from 'lucide-react'

interface PublicationItem {
  id: string
  title: string
  authors?: string | null
  journal?: string | null
  publication_date?: string | null
  doi?: string | null
  url?: string | null
  abstract?: string | null
  pub_type: string
}

interface PublicationsClientProps {
  initialPublications: PublicationItem[]
}

const pubTypes = [
  { value: 'article', label: 'Artigo Científico (Journal Article)' },
  { value: 'conference', label: 'Artigo de Conferência (Conference Paper)' },
  { value: 'book', label: 'Livro (Book)' },
  { value: 'chapter', label: 'Capítulo de Livro (Book Chapter)' },
  { value: 'thesis', label: 'Tese Académica (Thesis)' },
  { value: 'patent', label: 'Patente (Patent)' },
  { value: 'other', label: 'Outro' },
]

export default function PublicationsClient({ initialPublications }: PublicationsClientProps) {
  const [items, setItems] = useState<PublicationItem[]>(initialPublications)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Partial<PublicationItem> | null>(null)
  const [loading, setLoading] = useState(false)

  function handleOpenAdd() {
    setEditingItem({
      title: '',
      authors: '',
      journal: '',
      publication_date: '',
      doi: '',
      url: '',
      abstract: '',
      pub_type: 'article',
    })
    setModalOpen(true)
  }

  function handleOpenEdit(item: PublicationItem) {
    setEditingItem(item)
    setModalOpen(true)
  }

  async function handleDelete(id: string) {
    if (!confirm('Tens a certeza que queres eliminar esta publicação?')) return
    try {
      await deletePublication(id)
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
      authors: fd.get('authors') as string || null,
      journal: fd.get('journal') as string || null,
      publication_date: fd.get('publication_date') as string || null,
      doi: fd.get('doi') as string || null,
      url: fd.get('url') as string || null,
      abstract: fd.get('abstract') as string || null,
      pub_type: fd.get('pub_type') as string,
    }

    try {
      await upsertPublication(payload)
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
          <FileText className="w-5 h-5 text-brand-600" /> Publicações Registadas
        </h2>
        <button
          onClick={handleOpenAdd}
          className="btn-primary px-4 py-2 rounded-xl text-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Adicionar Publicação
        </button>
      </div>

      {/* Grid of cards */}
      {!items.length ? (
        <div className="bg-white/80 border border-gray-100 rounded-3xl p-10 text-center shadow-card">
          <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <h3 className="text-md font-bold text-gray-700 mb-1">Sem publicações científicas</h3>
          <p className="text-xs text-gray-400 max-w-xs mx-auto mb-4">
            Registe os seus artigos indexados, comunicações em conferências, capítulos de livros ou patentes.
          </p>
          <button onClick={handleOpenAdd} className="btn-secondary text-xs rounded-xl px-4 py-2">
            Adicionar publicação
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map(item => (
            <div
              key={item.id}
              className="bg-white/80 border border-gray-100 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all flex flex-col md:flex-row md:items-start justify-between gap-4"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-brand-50 text-brand-700 font-bold px-2 py-0.5 rounded-full uppercase border border-brand-100">
                    {pubTypes.find(t => t.value === item.pub_type)?.label.split(' ')[0] ?? item.pub_type}
                  </span>
                  {item.publication_date && (
                    <span className="text-xs text-gray-400 font-medium">
                      {new Date(item.publication_date).toLocaleDateString('pt-PT', { year: 'numeric', month: 'long' })}
                    </span>
                  )}
                </div>
                
                <h4 className="font-bold text-gray-900 text-base leading-snug">
                  {item.title}
                </h4>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-500 font-medium">
                  {item.authors && (
                    <div className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-gray-400" />
                      <span>{item.authors}</span>
                    </div>
                  )}
                  {item.journal && (
                    <div className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-gray-400" />
                      <span className="italic">{item.journal}</span>
                    </div>
                  )}
                  {item.doi && (
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-brand-600">DOI:</span>
                      <a href={`https://doi.org/${item.doi}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-gray-600">
                        {item.doi}
                      </a>
                    </div>
                  )}
                  {item.url && (
                    <div className="flex items-center gap-1">
                      <LinkIcon className="w-3.5 h-3.5 text-gray-400" />
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:underline text-brand-600 flex items-center gap-0.5">
                        Link Externo
                      </a>
                    </div>
                  )}
                </div>

                {item.abstract && (
                  <p className="text-xs text-gray-400 mt-2 bg-gray-50/50 rounded-xl p-3 border border-gray-100/50 leading-relaxed line-clamp-2">
                    {item.abstract}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1 shrink-0 self-end md:self-start">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-900 transition-colors border border-gray-100 bg-white"
                  title="Editar"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 hover:bg-red-50 rounded-lg text-gray-500 hover:text-red-600 transition-colors border border-gray-100 bg-white"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
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
                <FileText className="w-5 h-5 text-amber-400" />
                {editingItem.id ? 'Editar Publicação' : 'Adicionar Publicação'}
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
                  Tipo de Publicação
                </label>
                <select
                  name="pub_type"
                  defaultValue={editingItem.pub_type}
                  className="input-field text-sm"
                >
                  {pubTypes.map(t => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Título da Publicação
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={editingItem.title}
                  placeholder="Ex: Machine Learning em Medicina Tradicional Angolana"
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Lista de Autores (Separados por vírgulas)
                </label>
                <input
                  type="text"
                  name="authors"
                  defaultValue={editingItem.authors ?? ''}
                  placeholder="Ex: Silva, A., Ferreira, A. P., Neto, J."
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Revista / Jornal / Conferência / Editora
                </label>
                <input
                  type="text"
                  name="journal"
                  defaultValue={editingItem.journal ?? ''}
                  placeholder="Ex: Revista Angolana de Ciências, IEEE Access"
                  className="input-field text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Data de Publicação
                  </label>
                  <input
                    type="date"
                    name="publication_date"
                    defaultValue={editingItem.publication_date ?? ''}
                    className="input-field text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    DOI (Digital Object Identifier)
                  </label>
                  <input
                    type="text"
                    name="doi"
                    defaultValue={editingItem.doi ?? ''}
                    placeholder="Ex: 10.1109/ACCESS.2023..."
                    className="input-field text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  URL da Publicação (Opcional)
                </label>
                <input
                  type="url"
                  name="url"
                  defaultValue={editingItem.url ?? ''}
                  placeholder="Ex: https://ieeexplore.ieee.org/document/..."
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Resumo (Abstract - Opcional)
                </label>
                <textarea
                  name="abstract"
                  rows={3}
                  defaultValue={editingItem.abstract ?? ''}
                  placeholder="O resumo deste trabalho científico..."
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
