'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/lib/actions/auth'
import {
  Sparkles,
  LayoutDashboard,
  User,
  GraduationCap,
  Briefcase,
  FileText,
  Brain,
  Award,
  FolderGit2,
  BookmarkCheck,
  Menu,
  X,
  LogOut
} from 'lucide-react'

interface SidebarProps {
  profile: {
    full_name: string
    institution?: string | null
    department?: string | null
  } | null
}

const menuItems = [
  { href: '/dashboard', label: 'Início', icon: LayoutDashboard },
  { href: '/dashboard/profile', label: 'Meu Perfil', icon: User },
  { href: '/dashboard/education', label: 'Formação Académica', icon: GraduationCap },
  { href: '/dashboard/experience', label: 'Experiência Profissional', icon: Briefcase },
  { href: '/dashboard/publications', label: 'Publicações', icon: FileText },
  { href: '/dashboard/projects', label: 'Projectos', icon: FolderGit2 },
  { href: '/dashboard/certifications', label: 'Certificações', icon: BookmarkCheck },
  { href: '/dashboard/skills', label: 'Competências', icon: Brain },
  { href: '/dashboard/awards', label: 'Prémios e Bolsas', icon: Award },
] as const

export default function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const initials = profile?.full_name
    ? profile.full_name
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U'

  return (
    <>
      {/* Mobile Top Bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#1a3a5c] border-b border-white/10 flex items-center justify-between px-6 z-40 text-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold tracking-tight">CurriculumAI</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-45 backdrop-blur-xs"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-gradient-to-b from-[#1a3a5c] to-[#0d1f33] text-white flex flex-col p-6 z-50 transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo Panel */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center shadow-brand">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight">CurriculumAI</span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto scrollbar-thin pr-1">
          {menuItems.map(item => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-[13.5px] font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-white/15 text-white shadow-inner border border-white/5 font-semibold'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-white/60'}`} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User Profile Summary */}
        <div className="border-t border-white/10 pt-4 mt-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center font-bold text-amber-300 shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold truncate leading-tight">
              {profile?.full_name || 'Utilizador'}
            </div>
            <div className="text-[11px] text-white/55 truncate leading-none mt-1">
              {profile?.institution || 'Sem instituição'}
            </div>
          </div>
        </div>

        {/* Logout Form */}
        <div className="mt-4">
          <form action={logout}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium text-white/50 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              Sair da Conta
            </button>
          </form>
        </div>
      </aside>
    </>
  )
}
