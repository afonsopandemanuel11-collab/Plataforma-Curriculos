# CurriculumAI

Plataforma inteligente de currículos académicos, powered by [Claude AI](https://anthropic.com) e [Supabase](https://supabase.com).

---

## Stack tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 15 (App Router) |
| Base de dados | Supabase (PostgreSQL + RLS) |
| Autenticação | Supabase Auth |
| IA | Anthropic Claude (claude-sonnet-4-20250514) |
| Deploy | Vercel |
| Linguagem | TypeScript |

---

## Estrutura do projeto

```
curriculumai/
├── supabase/
│   ├── config.toml              # Configuração Supabase CLI
│   └── migrations/
│       └── 001_init.sql         # Schema completo
├── src/
│   ├── app/
│   │   ├── api/ai/generate/     # API Route para geração com IA
│   │   ├── auth/                # Login, signup, callback
│   │   ├── dashboard/           # Área autenticada
│   │   └── cv/                  # CV público (partilhável)
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts        # Cliente browser
│   │   │   └── server.ts        # Cliente servidor
│   │   └── actions/
│   │       ├── auth.ts          # Server Actions de autenticação
│   │       └── cv.ts            # Server Actions CRUD
│   ├── middleware.ts             # Proteção de rotas + refresh session
│   └── types/
│       └── database.ts          # Tipos TypeScript da base de dados
├── .env.example
├── next.config.ts
└── package.json
```

---

## Configuração local

### 1. Clonar e instalar

```bash
git clone https://github.com/SEU_USER/curriculumai.git
cd curriculumai
npm install
```

### 2. Variáveis de ambiente

```bash
cp .env.example .env.local
```

Edita `.env.local` com as tuas chaves:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Base de dados

#### Opção A — Supabase Cloud (recomendado)

1. Cria projeto em [supabase.com](https://supabase.com)
2. Vai a **SQL Editor** e executa o ficheiro `supabase/migrations/001_init.sql`
3. Copia as chaves de **Settings → API**

#### Opção B — Supabase local (desenvolvimento)

```bash
# Instalar Supabase CLI
npm install -g supabase

# Iniciar instância local
supabase start

# Aplicar migration
supabase db push
```

### 4. Iniciar desenvolvimento

```bash
npm run dev
# Acede a http://localhost:3000
```

---

## Deploy na Vercel

### Método rápido (recomendado)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/SEU_USER/curriculumai)

### Método manual

```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel

# ou deploy para produção
vercel --prod
```

### Variáveis de ambiente na Vercel

No dashboard Vercel → **Settings → Environment Variables**, adiciona:

| Variável | Valor |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do teu projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anon pública do Supabase |
| `ANTHROPIC_API_KEY` | Chave secreta Anthropic |
| `NEXT_PUBLIC_APP_URL` | URL da tua app na Vercel |

### Configurar Supabase para produção

Em **Supabase → Authentication → URL Configuration**:
- **Site URL**: `https://teu-projeto.vercel.app`
- **Redirect URLs**: `https://teu-projeto.vercel.app/auth/callback`

---

## Comandos úteis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run type-check   # Verificação de tipos TypeScript
npm run db:types     # Gerar tipos a partir do Supabase
npm run db:migrate   # Aplicar migrations (Supabase CLI)
npm run db:reset     # Reset base de dados local
```

---

## Schema da base de dados

O schema `curriculumai` coexiste com outros schemas no mesmo projeto Supabase.

### Tabelas principais

| Tabela | Descrição |
|--------|-----------|
| `profiles` | Dados do utilizador (criado automaticamente via trigger) |
| `curriculums` | Currículos criados (múltiplos por utilizador) |
| `education` | Formação académica |
| `experiences` | Experiência profissional |
| `publications` | Publicações científicas |
| `projects` | Projetos de investigação |
| `certifications` | Certificações |
| `skills` | Competências |
| `languages` | Idiomas |
| `awards` | Prémios e distinções |
| `references` | Referências profissionais |
| `generated_cvs` | PDFs gerados |
| `ai_logs` | Registo de chamadas à IA |

### Segurança

- **RLS activado** em todas as tabelas
- Utilizadores acedem apenas aos próprios dados
- Currículos públicos (`is_public = true`) visíveis a todos
- `ANTHROPIC_API_KEY` nunca exposta ao cliente

---

## Licença

MIT © CurriculumAI
