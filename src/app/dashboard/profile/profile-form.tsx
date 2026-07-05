'use client'

import { useState } from 'react'
import { updateProfile } from '@/lib/actions/cv'
import { Sparkles, Save, User, MapPin, Phone, Award, School, Globe, Linkedin, BookOpen } from 'lucide-react'

interface ProfileFormProps {
  initialProfile: {
    full_name: string
    phone?: string | null
    nationality?: string | null
    birth_date?: string | null
    institution?: string | null
    department?: string | null
    academic_level?: any | null
    bio?: string | null
    linkedin_url?: string | null
    orcid_id?: string | null
    website_url?: string | null
  }
}

export default function ProfileForm({ initialProfile }: ProfileFormProps) {
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  
  // IA State
  const [bio, setBio] = useState(initialProfile.bio ?? '')
  const [iaLoading, setIaLoading] = useState(false)

  async function handleImproveBio() {
    if (!bio.trim()) return
    setIaLoading(true)
    setErrorMsg(null)
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'improve_text',
          context: { text: bio },
        }),
      })
      const data = await response.json()
      if (data.error) throw new Error(data.error)
      if (data.text) {
        setBio(data.text)
        setSuccessMsg('Biografia otimizada com IA!')
        setTimeout(() => setSuccessMsg(null), 3000)
      }
    } catch (err: any) {
      console.error(err)
      setErrorMsg('Erro ao otimizar com IA: ' + err.message)
    } finally {
      setIaLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setSuccessMsg(null)
    setErrorMsg(null)
    
    const formData = new FormData(e.currentTarget)
    const payload = {
      full_name: formData.get('full_name') as string,
      phone: formData.get('phone') as string || null,
      nationality: formData.get('nationality') as string || null,
      birth_date: formData.get('birth_date') as string || null,
      institution: formData.get('institution') as string || null,
      department: formData.get('department') as string || null,
      academic_level: (formData.get('academic_level') as any) || null,
      bio: bio || null,
      linkedin_url: formData.get('linkedin_url') as string || null,
      orcid_id: formData.get('orcid_id') as string || null,
      website_url: formData.get('website_url') as string || null,
    }

    try {
      await updateProfile(payload)
      setSuccessMsg('Perfil atualizado com sucesso!')
      setTimeout(() => setSuccessMsg(null), 3000)
    } catch (err: any) {
      console.error(err)
      setErrorMsg('Erro ao atualizar perfil: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {successMsg && (
        <div className="p-4 bg-green-50 border border-green-100 rounded-xl text-sm text-green-700">
          ✅ {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Main Info */}
      <div className="grid md:grid-cols-2 gap-5 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl p-6 shadow-card">
        <h3 className="col-span-2 text-md font-bold text-gray-800 flex items-center gap-2 mb-2 border-b border-gray-50 pb-2">
          <User className="w-4 h-4 text-brand-600" /> Informação Pessoal
        </h3>
        
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Nome Completo</label>
          <input
            type="text"
            name="full_name"
            required
            defaultValue={initialProfile.full_name}
            placeholder="Ana Paula Ferreira"
            className="input-field text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Nacionalidade</label>
          <input
            type="text"
            name="nationality"
            defaultValue={initialProfile.nationality ?? ''}
            placeholder="Ex: Angola"
            className="input-field text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Telefone</label>
          <input
            type="tel"
            name="phone"
            defaultValue={initialProfile.phone ?? ''}
            placeholder="Ex: +244 923 000 000"
            className="input-field text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Data de Nascimento</label>
          <input
            type="date"
            name="birth_date"
            defaultValue={initialProfile.birth_date ?? ''}
            className="input-field text-sm"
          />
        </div>
      </div>

      {/* Academic Info */}
      <div className="grid md:grid-cols-2 gap-5 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl p-6 shadow-card">
        <h3 className="col-span-2 text-md font-bold text-gray-800 flex items-center gap-2 mb-2 border-b border-gray-50 pb-2">
          <School className="w-4 h-4 text-brand-600" /> Filiação Institucional e Grau
        </h3>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Instituição principal</label>
          <input
            type="text"
            name="institution"
            defaultValue={initialProfile.institution ?? ''}
            placeholder="Universidade Agostinho Neto"
            className="input-field text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Departamento / Centro</label>
          <input
            type="text"
            name="department"
            defaultValue={initialProfile.department ?? ''}
            placeholder="Faculdade de Ciências Médicas"
            className="input-field text-sm"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Nível Académico / Categoria</label>
          <select
            name="academic_level"
            defaultValue={initialProfile.academic_level ?? ''}
            className="input-field text-sm"
          >
            <option value="">Selecionar categoria...</option>
            <option value="licenciatura">Licenciatura</option>
            <option value="mestrado">Mestrado</option>
            <option value="doutoramento">Doutoramento</option>
            <option value="pos_doutoramento">Pós-Doutoramento</option>
            <option value="professor">Professor / Docente</option>
            <option value="investigador">Investigador</option>
            <option value="outro">Outro</option>
          </select>
        </div>
      </div>

      {/* Bio / Summary */}
      <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-gray-50 pb-2">
          <h3 className="text-md font-bold text-gray-800 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-brand-600" /> Biografia Académica / Resumo Profissional
          </h3>
          <button
            type="button"
            onClick={handleImproveBio}
            disabled={iaLoading || !bio.trim()}
            className="text-xs bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            {iaLoading ? (
              <span className="flex items-center gap-1">
                <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                A otimizar...
              </span>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Otimizar com IA
              </>
            )}
          </button>
        </div>
        <div>
          <textarea
            name="bio"
            rows={5}
            value={bio}
            onChange={e => setBio(e.target.value)}
            placeholder="Descreva resumidamente as suas áreas de investigação, conquistas académicas, orientações e publicações..."
            className="input-field text-sm resize-none"
          />
        </div>
      </div>

      {/* Links & Identifiers */}
      <div className="grid md:grid-cols-3 gap-5 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl p-6 shadow-card">
        <h3 className="col-span-3 text-md font-bold text-gray-800 flex items-center gap-2 mb-2 border-b border-gray-50 pb-2">
          <Globe className="w-4 h-4 text-brand-600" /> Identificadores e Links Científicos
        </h3>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">ORCID ID</label>
          <input
            type="text"
            name="orcid_id"
            defaultValue={initialProfile.orcid_id ?? ''}
            placeholder="0000-0000-0000-0000"
            className="input-field text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">LinkedIn URL</label>
          <input
            type="url"
            name="linkedin_url"
            defaultValue={initialProfile.linkedin_url ?? ''}
            placeholder="https://linkedin.com/in/..."
            className="input-field text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Website Pessoal / Blogue</label>
          <input
            type="url"
            name="website_url"
            defaultValue={initialProfile.website_url ?? ''}
            placeholder="https://meusite.com"
            className="input-field text-sm"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary px-6 py-3 rounded-2xl flex items-center gap-2 shadow-brand"
        >
          {loading ? 'A Guardar...' : <><Save className="w-4 h-4" /> Guardar Alterações</>}
        </button>
      </div>
    </form>
  )
}
