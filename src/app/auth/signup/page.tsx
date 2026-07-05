'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signup } from '@/lib/actions/auth'
import { Sparkles, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react'

const perks = [
  'Currículos gerados por IA em segundos',
  'Templates académicos profissionais',
  'Exportação PDF ilimitada',
  'Perfil público partilhável',
  'Totalmente grátis para começar',
]

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const fd = new FormData(e.currentTarget)
    if (fd.get('password') !== fd.get('confirm_password')) {
      setError('As palavras-passe não coincidem.')
      setLoading(false)
      return
    }
    const result = await signup(fd)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-accent-900 via-accent-700 to-brand-700 relative overflow-hidden flex-col items-center justify-center p-12">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/5" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-white/5" />
        </div>

        <div className="relative text-center text-white max-w-md">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold">CurriculumAI</span>
          </div>

          <h1 className="text-4xl font-extrabold mb-4 leading-tight">
            Junta-te a milhares de académicos
          </h1>
          <p className="text-white/70 text-lg leading-relaxed mb-10">
            Cria o teu currículo académico profissional em minutos com o poder da inteligência artificial.
          </p>

          <div className="space-y-4 text-left">
            {perks.map(perk => (
              <div key={perk} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                <span className="text-sm font-medium">{perk}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50/50">
        <div className="w-full max-w-md">
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">CurriculumAI</span>
          </div>

          <div className="bg-white rounded-3xl shadow-glass border border-gray-100 p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Criar conta grátis</h2>
              <p className="text-gray-500 text-sm">Começa a criar o teu currículo académico hoje</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome completo</label>
                <input
                  id="signup-name"
                  name="full_name"
                  type="text"
                  required
                  placeholder="Ex: Ana Paula Ferreira"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email institucional</label>
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  required
                  placeholder="nome@universidade.ao"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Palavra-passe</label>
                <div className="relative">
                  <input
                    id="signup-password"
                    name="password"
                    type={showPass ? 'text' : 'password'}
                    required
                    minLength={8}
                    placeholder="Mínimo 8 caracteres"
                    className="input-field pr-12"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar palavra-passe</label>
                <input
                  id="signup-confirm"
                  name="confirm_password"
                  type="password"
                  required
                  placeholder="Repete a palavra-passe"
                  className="input-field"
                />
              </div>

              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
                  <span className="shrink-0 mt-0.5">⚠️</span>
                  {error}
                </div>
              )}

              <button
                id="signup-submit"
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 rounded-xl text-base mt-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    A criar conta...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Criar conta grátis <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </button>

              <p className="text-xs text-center text-gray-400 mt-2">
                Ao criares uma conta, aceitas os nossos Termos de Serviço e Política de Privacidade.
              </p>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Já tens conta?{' '}
                <Link href="/auth/login" className="text-brand-600 font-medium hover:text-brand-700 transition-colors">
                  Entrar
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
