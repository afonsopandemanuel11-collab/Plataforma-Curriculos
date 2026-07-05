'use client'

import { useState } from 'react'
import Link from 'next/link'
import { login } from '@/lib/actions/auth'
import { Sparkles, Eye, EyeOff, ArrowRight, Brain } from 'lucide-react'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const fd = new FormData(e.currentTarget)
    const result = await login(fd)
    if (result?.error) {
      setError('Credenciais inválidas. Verifica o teu email e palavra-passe.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-900 via-brand-700 to-accent-700 relative overflow-hidden flex-col items-center justify-center p-12">
        {/* Background shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/5" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-white/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-accent-500/20" />
        </div>

        <div className="relative text-center text-white max-w-md">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold">CurriculumAI</span>
          </div>

          <h1 className="text-4xl font-extrabold mb-4 leading-tight">
            O teu currículo académico começa aqui
          </h1>
          <p className="text-white/70 text-lg leading-relaxed mb-10">
            Plataforma inteligente para académicos, investigadores e estudantes lusófonos.
          </p>

          <div className="grid grid-cols-3 gap-4">
            {[
              { v: '10k+', l: 'Utilizadores' },
              { v: '50k+', l: 'Currículos' },
              { v: '4.9★', l: 'Avaliação' },
            ].map(({ v, l }) => (
              <div key={l} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold">{v}</div>
                <div className="text-sm text-white/60 mt-1">{l}</div>
              </div>
            ))}
          </div>

          {/* Floating card demo */}
          <div className="mt-10 bg-white/10 backdrop-blur-sm rounded-2xl p-5 text-left border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-accent-400 flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold">IA a gerar...</div>
                <div className="text-xs text-white/50">Resumo académico</div>
              </div>
            </div>
            <p className="text-sm text-white/80 leading-relaxed">
              "Investigador com foco em machine learning aplicado às ciências da saúde, com 12 publicações em revistas indexadas..."
            </p>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50/50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">CurriculumAI</span>
          </div>

          <div className="bg-white rounded-3xl shadow-glass border border-gray-100 p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Bem-vindo de volta</h2>
              <p className="text-gray-500 text-sm">Entra na tua conta para continuar</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  required
                  placeholder="nome@instituicao.ao"
                  className="input-field"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Palavra-passe</label>
                  <a href="#" className="text-xs text-brand-600 hover:text-brand-700">Esqueceste?</a>
                </div>
                <div className="relative">
                  <input
                    id="login-password"
                    name="password"
                    type={showPass ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    className="input-field pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
                  <span className="shrink-0 mt-0.5">⚠️</span>
                  {error}
                </div>
              )}

              <button
                id="login-submit"
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 rounded-xl text-base"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    A entrar...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Entrar <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Não tens conta?{' '}
                <Link href="/auth/signup" className="text-brand-600 font-medium hover:text-brand-700 transition-colors">
                  Regista-te grátis
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
