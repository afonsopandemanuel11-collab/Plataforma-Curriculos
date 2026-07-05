'use client'

import { useState } from 'react'
import { upsertCertification, deleteCertification } from '@/lib/actions/cv'
import { Plus, Trash2, Edit2, BookmarkCheck, Calendar, Link as LinkIcon, ShieldCheck, X, Save } from 'lucide-react'

interface CertificationItem {
  id: string
  name: string
  issuing_organization?: string | null
  issue_date?: string | null
  expiry_date?: string | null
  credential_id?: string | null
  credential_url?: string | null
}

interface CertificationsClientProps {
  initialCertifications: CertificationItem[]
}

export default function CertificationsClient({ initialCertifications }: CertificationsClientProps) {
  const [items, setItems] = useState<CertificationItem[]>(initialCertifications)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Partial<CertificationItem> | null>(null)
  const [loading, setLoading] = useState(false)

  function handleOpenAdd() {
    setEditingItem({
      name: '',
      issuing_organization: '',
      issue_date: '',
      expiry_date: '',
      credential_id: '',
      credential_url: '',
    })
    setModalOpen(true)
  }

  function handleOpenEdit(item: CertificationItem) {
    setEditingItem(item)
    setModalOpen(true)
  }

  async function handleDelete(id: string) {
    if (!confirm('Tens a certeza que queres eliminar esta certificação?')) return
    try {
      await deleteCertification(id)
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
      name: fd.get('name') as string,
      issuing_organization: fd.get('issuing_organization') as string || null,
      issue_date: fd.get('issue_date') as string || null,
      expiry_date: fd.get('expiry_date') as string || null,
      credential_id: fd.get('credential_id') as string || null,
      credential_url: fd.get('credential_url') as string || null,
    }

    try {
      await upsertCertification(payload)
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
          <BookmarkCheck className="w-5 h-5 text-brand-600" /> Certificações Registadas
        </h2>
        <button
          onClick={handleOpenAdd}
          className="btn-primary px-4 py-2 rounded-xl text-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Adicionar Certificação
        </button>
      </div>

      {/* Grid of cards */}
      {!items.length ? (
        <div className="bg-white/80 border border-gray-100 rounded-3xl p-10 text-center shadow-card">
          <BookmarkCheck className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <h3 className="text-md font-bold text-gray-700 mb-1">Sem certificações registadas</h3>
          <p className="text-xs text-gray-400 max-w-xs mx-auto mb-4">
            Registe certificações profissionais, cursos livres ou equivalências que complementem o seu currículo.
          </p>
          <button onClick={handleOpenAdd} className="btn-secondary text-xs rounded-xl px-4 py-2">
            Adicionar certificação
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
                    {item.name}
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
                  {item.issuing_organization && (
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
                      <span>{item.issuing_organization}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>
                      Emitida em:{' '}
                      {item.issue_date
                        ? new Date(item.issue_date).toLocaleDateString('pt-PT', { year: 'numeric', month: 'short' })
                        : 'N/D'}
                      {item.expiry_date ? ` (Expira em: ${new Date(item.expiry_date).toLocaleDateString('pt-PT', { year: 'numeric', month: 'short' })})` : ' (Válida indefinidamente)'}
                    </span>
                  </div>
                  {item.credential_id && (
                    <div className="text-xs text-gray-400">
                      ID da Credencial: <span className="font-semibold text-gray-700">{item.credential_id}</span>
                    </div>
                  )}
                  {item.credential_url && (
                    <div className="flex items-center gap-1.5">
                      <LinkIcon className="w-3.5 h-3.5 text-gray-400" />
                      <a href={item.credential_url} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">
                        Verificar Credencial
                      </a>
                    </div>
                  )}
                </div>
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
                <BookmarkCheck className="w-5 h-5 text-amber-400" />
                {editingItem.id ? 'Editar Certificação' : 'Adicionar Certificação'}
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
                  Nome da Certificação / Curso / Credencial
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingItem.name}
                  placeholder="Ex: CCNA Routing & Switching, Curso de Metodologia Científica"
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Organização Emissora
                </label>
                <input
                  type="text"
                  name="issuing_organization"
                  defaultValue={editingItem.issuing_organization ?? ''}
                  placeholder="Ex: Cisco Academy, Universidade de Luanda"
                  className="input-field text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Data de Emissão
                  </label>
                  <input
                    type="date"
                    name="issue_date"
                    defaultValue={editingItem.issue_date ?? ''}
                    className="input-field text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Data de Expiração (Se aplicável)
                  </label>
                  <input
                    type="date"
                    name="expiry_date"
                    defaultValue={editingItem.expiry_date ?? ''}
                    className="input-field text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Código da Credencial / ID
                </label>
                <input
                  type="text"
                  name="credential_id"
                  defaultValue={editingItem.credential_id ?? ''}
                  placeholder="Ex: CCNA-12345678"
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  URL de Verificação
                </label>
                <input
                  type="url"
                  name="credential_url"
                  defaultValue={editingItem.credential_url ?? ''}
                  placeholder="Ex: https://verify.cisco.com/..."
                  className="input-field text-sm"
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
