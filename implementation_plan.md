# Plano de Migração Atualizado: PostgreSQL Local + Armazenamento Local de Ficheiros

Este plano atualiza o processo de migração para incluir a regra principal de **armazenamento local de ficheiros** (substituindo qualquer dependência externa ou banco de dados) e a conclusão da migração da autenticação e logs do Supabase para o sistema local.

---

## FASE 1 — RELATÓRIO DE ANÁLISE PRÉVIA (OBRIGATÓRIO)

### 1. Pontos de Manipulação de Ficheiros no Código

* **Upload de Ficheiros**:
  * **Estado Atual**: Não existe nenhum formulário ou rota de API configurada para receber uploads de ficheiros binários. O formulário de perfil (`src/app/dashboard/profile/profile-form.tsx`) atualiza apenas campos de texto.
  * **Ação Necessária**: Adicionar suporte a upload de imagem de perfil (avatar) no `profile-form.tsx` e integrá-lo com a lógica local.

* **Gravação de Ficheiros**:
  * **Estado Atual**: O ficheiro `src/lib/storage.ts` está implementado e configurado para gravar no disco em `./storage/uploads/` através da função `saveFile(folder, filename, buffer, mimeType)`. No entanto, **não é invocado por nenhuma ação ou rota**.
  * **Ação Necessária**: Ligar o fluxo de gravação de imagens de perfil à função `saveFile`.

* **Leitura/Serviço de Ficheiros**:
  * **Estado Atual**: Existe uma rota de API segura em `src/app/api/files/[...path]/route.ts` que valida a sessão do utilizador (via cookie JWT) e serve ficheiros do disco local.
  * **Ação Necessária**: Utilizar este endpoint para renderizar a imagem de perfil na Sidebar e no Formulário de Perfil (ex: `/api/files/avatars/uuid-name.jpg`).

* **Eliminação de Ficheiros**:
  * **Estado Atual**: `src/lib/storage.ts` possui a função `deleteFile(filePath)` para remover ficheiros do disco local, mas ela não é chamada no código.
  * **Ação Necessária**: Eliminar o avatar antigo do disco local quando o utilizador atualizar a sua foto de perfil.

### 2. Referências ao Supabase Storage
* Foi efetuada uma pesquisa detalhada em todo o projeto.
* A única referência restante é no ficheiro `next.config.ts`, onde o domínio do Supabase (`*.supabase.co`) está configurado em `remotePatterns` para imagens.
* Nenhuma função do código utiliza chamadas a `supabase.storage` ou buckets.

### 3. Mapeamento de Tipos de Ficheiro em Uso
* **Imagens de Perfil (Avatars)**: `image/jpeg`, `image/png`, `image/webp`, `image/gif`. Gravadas na subpasta `/storage/uploads/avatars/`.
* **Currículos Gerados (CVs)**: `application/pdf`. Planeado para a subpasta `/storage/uploads/cvs/`.

### 4. Outras Lacunas e Bugs Críticos Identificados

* **Bug de Nomenclatura (camelCase vs snake_case)**:
  * O Prisma mapeia os campos da tabela para camelCase (ex: `fullName`, `profilePhoto`, `orcidId`, `linkedinUrl`).
  * No entanto, o `profile-form.tsx` e o `src/app/dashboard/page.tsx` ainda referenciam os campos em snake_case (ex: `full_name`, `profile_photo`, `orcid_id`), resultando em valores `undefined` que impossibilitam a leitura ou atualização correta dos perfis.
* **Imports Duplicados**:
  * Oito páginas do dashboard contêm duas linhas idênticas de importação do `getUser` (`import { getUser } from '@/lib/actions/auth'`), o que causa erros de compilação em TypeScript/build.
* **AI Generate API Route**:
  * A rota `src/app/api/ai/generate/route.ts` ainda importa e utiliza o cliente Supabase para obter a sessão (`supabase.auth.getUser()`) e registar os logs na tabela `ai_logs` via cliente Supabase (`supabase.schema('curriculumai').from('ai_logs')`).
* **Auth Callback & Resíduos do Supabase**:
  * A rota `src/app/auth/callback/route.ts` ainda usa Supabase.
  * As dependências `@supabase/supabase-js`, `@supabase/ssr` e `supabase` ainda estão presentes no `package.json`.

---

## FASE 2 — PROPOSTA DE ALTERAÇÕES

### 1. Correção de Bugs e Conclusão da Migração

#### [MODIFY] [src/app/dashboard/page.tsx](file:///d:/curriculumai/curriculumai/curriculumai/src/app/dashboard/page.tsx)
* Corrigir as propriedades de snake_case para camelCase:
  * `profile?.full_name` para `profile?.fullName`
  * `cv.is_public` para `cv.isPublic`
  * `cv.template_name` para `cv.templateName`
  * `cv.ai_generated` para `cv.aiGenerated`

#### [MODIFY] [src/app/dashboard/profile/profile-form.tsx](file:///d:/curriculumai/curriculumai/curriculumai/src/app/dashboard/profile/profile-form.tsx)
* Adaptar a interface e a exibição de dados para camelCase (`fullName`, `orcidId`, etc.).
* Adicionar um campo de input visualmente elegante para upload/alteração de foto de perfil (com pré-visualização instantânea).

#### [MODIFY] Páginas do Dashboard (Remover imports duplicados)
* [education/page.tsx](file:///d:/curriculumai/curriculumai/curriculumai/src/app/dashboard/education/page.tsx)
* [experience/page.tsx](file:///d:/curriculumai/curriculumai/curriculumai/src/app/dashboard/experience/page.tsx)
* [publications/page.tsx](file:///d:/curriculumai/curriculumai/curriculumai/src/app/dashboard/publications/page.tsx)
* [skills/page.tsx](file:///d:/curriculumai/curriculumai/curriculumai/src/app/dashboard/skills/page.tsx)
* [awards/page.tsx](file:///d:/curriculumai/curriculumai/curriculumai/src/app/dashboard/awards/page.tsx)
* [certifications/page.tsx](file:///d:/curriculumai/curriculumai/curriculumai/src/app/dashboard/certifications/page.tsx)
* [projects/page.tsx](file:///d:/curriculumai/curriculumai/curriculumai/src/app/dashboard/projects/page.tsx)
* [profile/page.tsx](file:///d:/curriculumai/curriculumai/curriculumai/src/app/dashboard/profile/page.tsx)

#### [MODIFY] [src/app/api/ai/generate/route.ts](file:///d:/curriculumai/curriculumai/curriculumai/src/app/api/ai/generate/route.ts)
* Substituir a autenticação e gravação do Supabase por:
  * Obter utilizador via JWT local (importando `verifyToken` de `@/lib/auth-utils` e lendo cookie de sessão).
  * Escrever o log utilizando o cliente Prisma (`prisma.aiLog.create`).

#### [DELETE] [src/app/auth/callback/route.ts](file:///d:/curriculumai/curriculumai/curriculumai/src/app/auth/callback/route.ts)
* Eliminar esta rota, uma vez que não é utilizada na autenticação customizada local.

---

### 2. Implementação do Armazenamento de Ficheiros Local

#### [NEW] [src/lib/actions/files.ts](file:///d:/curriculumai/curriculumai/curriculumai/src/lib/actions/files.ts)
* Criar uma Server Action dedicada `uploadAvatar(formData: FormData)`:
  * Validar a sessão do utilizador.
  * Extrair o ficheiro do FormData.
  * Validar o tamanho (limite 10MB) e tipo MIME (jpeg, png, webp, gif).
  * Obter o perfil do utilizador. Se já possuir foto de perfil anterior (`profilePhoto`), chamar `deleteFile()` para eliminá-la do disco.
  * Gerar nome único através de `generateFileName()` e guardar com `saveFile()`.
  * Atualizar o campo `profilePhoto` na tabela `Profile` no banco de dados.
  * Retornar o caminho relativo para atualizar o estado do cliente.

#### [MODIFY] [src/components/layout/sidebar.tsx](file:///d:/curriculumai/curriculumai/curriculumai/src/components/layout/sidebar.tsx)
* Modificar a tipagem para receber o perfil com camelCase.
* Se `profile?.profilePhoto` existir, carregar a imagem apontando para `/api/files/${profile.profilePhoto}`.
* Caso contrário, continuar a mostrar as iniciais do utilizador.

#### [MODIFY] [src/app/dashboard/profile/profile-form.tsx](file:///d:/curriculumai/curriculumai/curriculumai/src/app/dashboard/profile/profile-form.tsx)
* Mostrar o componente de avatar de perfil.
* Ligar o upload de ficheiro ao Server Action `uploadAvatar`.
* Ligar a atualização de dados normais ao `updateProfile` com os mapeamentos camelCase corretos.

#### [MODIFY] [src/lib/actions/cv.ts](file:///d:/curriculumai/curriculumai/curriculumai/src/lib/actions/cv.ts)
* Atualizar os mapeamentos de dados em `updateProfile` para que as chaves recebidas do formulário do cliente coincidam exatamente com os campos camelCase exigidos pelo Prisma.

#### [MODIFY] [.gitignore](file:///d:/curriculumai/curriculumai/curriculumai/.gitignore)
* Adicionar as regras para não versionar ficheiros carregados pelos utilizadores locais:
  ```text
  /storage/uploads/
  !/storage/uploads/.gitkeep
  ```

#### [NEW] [storage/uploads/.gitkeep](file:///d:/curriculumai/curriculumai/curriculumai/storage/uploads/.gitkeep)
* Criar o diretório de storage e adicionar um `.gitkeep` para persistir a estrutura inicial no repositório sem carregar ficheiros reais.

---

### 3. Limpeza de Código e Dependências

#### [MODIFY] [package.json](file:///d:/curriculumai/curriculumai/curriculumai/package.json)
* Remover dependências obsoletas do Supabase:
  * `@supabase/ssr`
  * `@supabase/supabase-js`
  * `supabase`
* Atualizar os scripts de banco de dados para usar Prisma CLI em vez de CLI do Supabase:
  * `"db:migrate": "prisma migrate dev"`
  * `"db:reset": "prisma migrate reset"`
  * (Remover `"db:types"` ou mantê-lo vazio/obsoleto)

#### [DELETE] Ficheiros Supabase Obsoletos
* [src/lib/supabase/client.ts](file:///d:/curriculumai/curriculumai/curriculumai/src/lib/supabase/client.ts)
* [src/lib/supabase/server.ts](file:///d:/curriculumai/curriculumai/curriculumai/src/lib/supabase/server.ts)

---

## VERIFICATION PLAN

### Testes Automáticos / Builds
1. Correr `npm run build` para garantir que todos os erros de TypeScript, imports duplicados e incompatibilidades de tipos foram 100% resolvidos.

### Testes Manuais (Procedimento de Validação)
1. **Upload de Foto de Perfil**:
   * Aceder ao Dashboard -> Meu Perfil.
   * Selecionar e carregar uma imagem (.jpg / .png).
   * Verificar se a imagem aparece imediatamente como preview e se é exibida na Sidebar.
   * Confirmar na base de dados que a coluna `profile_photo` tem um caminho relativo como `avatars/uuid.png`.
   * Verificar que o ficheiro físico foi gravado na pasta `./storage/uploads/avatars/`.
2. **Atualização de Foto (Substituição)**:
   * Carregar uma nova imagem.
   * Verificar se a imagem antiga foi eliminada do disco físico `./storage/uploads/avatars/`.
3. **Segurança de Acesso**:
   * Aceder diretamente ao URL do ficheiro (ex: `http://localhost:3000/api/files/avatars/nome.png`) a partir de uma janela anónima (sem login).
   * Confirmar que a API bloqueia o acesso com erro `401 - Não autenticado`.
4. **AI Generate Route**:
   * Aceder à secção de Competências e clicar em "Gerar sugestões com IA".
   * Confirmar que as sugestões de IA são geradas corretamente e que um registo foi gravado com sucesso na tabela local `ai_logs` via Prisma.
