'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { getUser } from '@/lib/actions/auth'

// ── Currículos ────────────────────────────────────────────────────────────────

export async function getCurriculums() {
  const user = await getUser()
  if (!user) return []

  return prisma.curriculum.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  })
}

export async function createCurriculum(payload: {
  title: string
  summary?: string | null
  templateName?: 'academic' | 'research' | 'industry' | 'minimal'
  language?: string
  aiGenerated?: boolean
  isPublic?: boolean
  isDefault?: boolean
}) {
  const user = await getUser()
  if (!user) throw new Error('Não autenticado')

  const data = await prisma.curriculum.create({
    data: {
      userId: user.id,
      title: payload.title,
      summary: payload.summary ?? null,
      templateName: (payload.templateName as any) ?? 'academic',
      language: payload.language ?? 'pt',
      aiGenerated: payload.aiGenerated ?? false,
      isPublic: payload.isPublic ?? false,
      isDefault: payload.isDefault ?? false,
    },
  })

  revalidatePath('/dashboard')
  return data
}

export async function updateCurriculum(id: string, payload: Partial<{
  title: string
  summary: string | null
  templateName: string
  language: string
  aiGenerated: boolean
  isPublic: boolean
  isDefault: boolean
}>) {
  const user = await getUser()
  if (!user) throw new Error('Não autenticado')

  await prisma.curriculum.updateMany({
    where: { id, userId: user.id },
    data: payload as any,
  })

  revalidatePath('/dashboard')
  revalidatePath(`/cv/${id}`)
}

export async function deleteCurriculum(id: string) {
  const user = await getUser()
  if (!user) throw new Error('Não autenticado')

  await prisma.curriculum.deleteMany({
    where: { id, userId: user.id },
  })

  revalidatePath('/dashboard')
}

// ── Formação Académica ────────────────────────────────────────────────────────

export async function getEducation() {
  const user = await getUser()
  if (!user) return []

  return prisma.education.findMany({
    where: { userId: user.id },
    orderBy: [{ sortOrder: 'asc' }, { startDate: 'desc' }],
  })
}

export async function upsertEducation(payload: {
  id?: string
  institution: string
  degree: string
  fieldOfStudy?: string | null
  startDate?: string | null
  endDate?: string | null
  isCurrent?: boolean
  grade?: string | null
  description?: string | null
  sortOrder?: number
}) {
  const user = await getUser()
  if (!user) throw new Error('Não autenticado')

  const data = {
    userId: user.id,
    institution: payload.institution,
    degree: payload.degree,
    fieldOfStudy: payload.fieldOfStudy ?? null,
    startDate: payload.startDate ? new Date(payload.startDate) : null,
    endDate: payload.endDate ? new Date(payload.endDate) : null,
    isCurrent: payload.isCurrent ?? false,
    grade: payload.grade ?? null,
    description: payload.description ?? null,
    sortOrder: payload.sortOrder ?? 0,
  }

  if (payload.id) {
    await prisma.education.updateMany({ where: { id: payload.id, userId: user.id }, data })
  } else {
    await prisma.education.create({ data })
  }

  revalidatePath('/dashboard')
}

export async function deleteEducation(id: string) {
  const user = await getUser()
  if (!user) throw new Error('Não autenticado')

  await prisma.education.deleteMany({ where: { id, userId: user.id } })
  revalidatePath('/dashboard')
}

// ── Experiência Profissional ──────────────────────────────────────────────────

export async function getExperiences() {
  const user = await getUser()
  if (!user) return []

  return prisma.experience.findMany({
    where: { userId: user.id },
    orderBy: [{ sortOrder: 'asc' }, { startDate: 'desc' }],
  })
}

export async function upsertExperience(payload: {
  id?: string
  organization: string
  role: string
  location?: string | null
  startDate?: string | null
  endDate?: string | null
  isCurrent?: boolean
  description?: string | null
  sortOrder?: number
}) {
  const user = await getUser()
  if (!user) throw new Error('Não autenticado')

  const data = {
    userId: user.id,
    organization: payload.organization,
    role: payload.role,
    location: payload.location ?? null,
    startDate: payload.startDate ? new Date(payload.startDate) : null,
    endDate: payload.endDate ? new Date(payload.endDate) : null,
    isCurrent: payload.isCurrent ?? false,
    description: payload.description ?? null,
    sortOrder: payload.sortOrder ?? 0,
  }

  if (payload.id) {
    await prisma.experience.updateMany({ where: { id: payload.id, userId: user.id }, data })
  } else {
    await prisma.experience.create({ data })
  }

  revalidatePath('/dashboard')
}

export async function deleteExperience(id: string) {
  const user = await getUser()
  if (!user) throw new Error('Não autenticado')

  await prisma.experience.deleteMany({ where: { id, userId: user.id } })
  revalidatePath('/dashboard')
}

// ── Publicações ───────────────────────────────────────────────────────────────

export async function getPublications() {
  const user = await getUser()
  if (!user) return []

  return prisma.publication.findMany({
    where: { userId: user.id },
    orderBy: [{ sortOrder: 'asc' }, { publicationDate: 'desc' }],
  })
}

export async function upsertPublication(payload: {
  id?: string
  title: string
  authors?: string | null
  journal?: string | null
  publicationDate?: string | null
  doi?: string | null
  url?: string | null
  abstract?: string | null
  pubType?: string
  sortOrder?: number
}) {
  const user = await getUser()
  if (!user) throw new Error('Não autenticado')

  const data = {
    userId: user.id,
    title: payload.title,
    authors: payload.authors ?? null,
    journal: payload.journal ?? null,
    publicationDate: payload.publicationDate ? new Date(payload.publicationDate) : null,
    doi: payload.doi ?? null,
    url: payload.url ?? null,
    abstract: payload.abstract ?? null,
    pubType: payload.pubType ?? 'article',
    sortOrder: payload.sortOrder ?? 0,
  }

  if (payload.id) {
    await prisma.publication.updateMany({ where: { id: payload.id, userId: user.id }, data })
  } else {
    await prisma.publication.create({ data })
  }

  revalidatePath('/dashboard')
}

export async function deletePublication(id: string) {
  const user = await getUser()
  if (!user) throw new Error('Não autenticado')

  await prisma.publication.deleteMany({ where: { id, userId: user.id } })
  revalidatePath('/dashboard')
}

// ── Competências ──────────────────────────────────────────────────────────────

export async function getSkills() {
  const user = await getUser()
  if (!user) return []

  return prisma.skill.findMany({
    where: { userId: user.id },
    orderBy: { sortOrder: 'asc' },
  })
}

export async function upsertSkill(payload: {
  id?: string
  skillName: string
  category?: string | null
  proficiencyLevel?: 'basico' | 'intermediario' | 'avancado' | 'especialista' | null
  sortOrder?: number
}) {
  const user = await getUser()
  if (!user) throw new Error('Não autenticado')

  const data = {
    userId: user.id,
    skillName: payload.skillName,
    category: payload.category ?? null,
    proficiencyLevel: (payload.proficiencyLevel as any) ?? null,
    sortOrder: payload.sortOrder ?? 0,
  }

  if (payload.id) {
    await prisma.skill.updateMany({ where: { id: payload.id, userId: user.id }, data })
  } else {
    await prisma.skill.create({ data })
  }

  revalidatePath('/dashboard')
}

export async function deleteSkill(id: string) {
  const user = await getUser()
  if (!user) throw new Error('Não autenticado')

  await prisma.skill.deleteMany({ where: { id, userId: user.id } })
  revalidatePath('/dashboard')
}

// ── Prémios ───────────────────────────────────────────────────────────────────

export async function getAwards() {
  const user = await getUser()
  if (!user) return []

  return prisma.award.findMany({
    where: { userId: user.id },
    orderBy: [{ sortOrder: 'asc' }, { awardDate: 'desc' }],
  })
}

export async function upsertAward(payload: {
  id?: string
  title: string
  issuer?: string | null
  awardDate?: string | null
  description?: string | null
  sortOrder?: number
}) {
  const user = await getUser()
  if (!user) throw new Error('Não autenticado')

  const data = {
    userId: user.id,
    title: payload.title,
    issuer: payload.issuer ?? null,
    awardDate: payload.awardDate ? new Date(payload.awardDate) : null,
    description: payload.description ?? null,
    sortOrder: payload.sortOrder ?? 0,
  }

  if (payload.id) {
    await prisma.award.updateMany({ where: { id: payload.id, userId: user.id }, data })
  } else {
    await prisma.award.create({ data })
  }

  revalidatePath('/dashboard')
}

export async function deleteAward(id: string) {
  const user = await getUser()
  if (!user) throw new Error('Não autenticado')

  await prisma.award.deleteMany({ where: { id, userId: user.id } })
  revalidatePath('/dashboard')
}

// ── Perfil ────────────────────────────────────────────────────────────────────

export async function getProfile() {
  const user = await getUser()
  if (!user) return null

  return prisma.profile.findUnique({ where: { id: user.id } })
}

export async function updateProfile(payload: Partial<{
  fullName: string
  phone: string | null
  nationality: string | null
  birthDate: string | null
  institution: string | null
  department: string | null
  academicLevel: string | null
  bio: string | null
  profilePhoto: string | null
  linkedinUrl: string | null
  orcidId: string | null
  websiteUrl: string | null
}>) {
  const user = await getUser()
  if (!user) throw new Error('Não autenticado')

  await prisma.profile.update({
    where: { id: user.id },
    data: {
      ...(payload.fullName !== undefined && { fullName: payload.fullName }),
      ...(payload.phone !== undefined && { phone: payload.phone }),
      ...(payload.nationality !== undefined && { nationality: payload.nationality }),
      ...(payload.birthDate !== undefined && { birthDate: payload.birthDate ? new Date(payload.birthDate) : null }),
      ...(payload.institution !== undefined && { institution: payload.institution }),
      ...(payload.department !== undefined && { department: payload.department }),
      ...(payload.academicLevel !== undefined && { academicLevel: (payload.academicLevel as any) }),
      ...(payload.bio !== undefined && { bio: payload.bio }),
      ...(payload.profilePhoto !== undefined && { profilePhoto: payload.profilePhoto }),
      ...(payload.linkedinUrl !== undefined && { linkedinUrl: payload.linkedinUrl }),
      ...(payload.orcidId !== undefined && { orcidId: payload.orcidId }),
      ...(payload.websiteUrl !== undefined && { websiteUrl: payload.websiteUrl }),
    },
  })

  revalidatePath('/dashboard')
  revalidatePath('/profile')
}

// ── Projectos ──────────────────────────────────────────────────────────────────

export async function getProjects() {
  const user = await getUser()
  if (!user) return []

  return prisma.project.findMany({
    where: { userId: user.id },
    orderBy: { sortOrder: 'asc' },
  })
}

export async function upsertProject(payload: {
  id?: string
  title: string
  description?: string | null
  role?: string | null
  startDate?: string | null
  endDate?: string | null
  isCurrent?: boolean
  fundingEntity?: string | null
  budget?: number | null
  url?: string | null
  sortOrder?: number
}) {
  const user = await getUser()
  if (!user) throw new Error('Não autenticado')

  const data = {
    userId: user.id,
    title: payload.title,
    description: payload.description ?? null,
    role: payload.role ?? null,
    startDate: payload.startDate ? new Date(payload.startDate) : null,
    endDate: payload.endDate ? new Date(payload.endDate) : null,
    isCurrent: payload.isCurrent ?? false,
    fundingEntity: payload.fundingEntity ?? null,
    budget: payload.budget ?? null,
    url: payload.url ?? null,
    sortOrder: payload.sortOrder ?? 0,
  }

  if (payload.id) {
    await prisma.project.updateMany({ where: { id: payload.id, userId: user.id }, data })
  } else {
    await prisma.project.create({ data })
  }

  revalidatePath('/dashboard')
}

export async function deleteProject(id: string) {
  const user = await getUser()
  if (!user) throw new Error('Não autenticado')

  await prisma.project.deleteMany({ where: { id, userId: user.id } })
  revalidatePath('/dashboard')
}

// ── Certificações ──────────────────────────────────────────────────────────────

export async function getCertifications() {
  const user = await getUser()
  if (!user) return []

  return prisma.certification.findMany({
    where: { userId: user.id },
    orderBy: { sortOrder: 'asc' },
  })
}

export async function upsertCertification(payload: {
  id?: string
  name: string
  issuingOrganization?: string | null
  issueDate?: string | null
  expiryDate?: string | null
  credentialId?: string | null
  credentialUrl?: string | null
  sortOrder?: number
}) {
  const user = await getUser()
  if (!user) throw new Error('Não autenticado')

  const data = {
    userId: user.id,
    name: payload.name,
    issuingOrganization: payload.issuingOrganization ?? null,
    issueDate: payload.issueDate ? new Date(payload.issueDate) : null,
    expiryDate: payload.expiryDate ? new Date(payload.expiryDate) : null,
    credentialId: payload.credentialId ?? null,
    credentialUrl: payload.credentialUrl ?? null,
    sortOrder: payload.sortOrder ?? 0,
  }

  if (payload.id) {
    await prisma.certification.updateMany({ where: { id: payload.id, userId: user.id }, data })
  } else {
    await prisma.certification.create({ data })
  }

  revalidatePath('/dashboard')
}

export async function deleteCertification(id: string) {
  const user = await getUser()
  if (!user) throw new Error('Não autenticado')

  await prisma.certification.deleteMany({ where: { id, userId: user.id } })
  revalidatePath('/dashboard')
}

// ── Idiomas ────────────────────────────────────────────────────────────────────

export async function getLanguages() {
  const user = await getUser()
  if (!user) return []

  return prisma.language.findMany({
    where: { userId: user.id },
    orderBy: { sortOrder: 'asc' },
  })
}

export async function upsertLanguage(payload: {
  id?: string
  language: string
  proficiency?: string
  sortOrder?: number
}) {
  const user = await getUser()
  if (!user) throw new Error('Não autenticado')

  const data = {
    userId: user.id,
    language: payload.language,
    proficiency: payload.proficiency ?? 'intermediario',
    sortOrder: payload.sortOrder ?? 0,
  }

  if (payload.id) {
    await prisma.language.updateMany({ where: { id: payload.id, userId: user.id }, data })
  } else {
    await prisma.language.create({ data })
  }

  revalidatePath('/dashboard')
}

export async function deleteLanguage(id: string) {
  const user = await getUser()
  if (!user) throw new Error('Não autenticado')

  await prisma.language.deleteMany({ where: { id, userId: user.id } })
  revalidatePath('/dashboard')
}

// ── Referências ─────────────────────────────────────────────────────────────────

export async function getReferences() {
  const user = await getUser()
  if (!user) return []

  return prisma.reference.findMany({
    where: { userId: user.id },
    orderBy: { sortOrder: 'asc' },
  })
}

export async function upsertReference(payload: {
  id?: string
  name: string
  title?: string | null
  organization?: string | null
  email?: string | null
  phone?: string | null
  isVisible?: boolean
  sortOrder?: number
}) {
  const user = await getUser()
  if (!user) throw new Error('Não autenticado')

  const data = {
    userId: user.id,
    name: payload.name,
    title: payload.title ?? null,
    organization: payload.organization ?? null,
    email: payload.email ?? null,
    phone: payload.phone ?? null,
    isVisible: payload.isVisible ?? false,
    sortOrder: payload.sortOrder ?? 0,
  }

  if (payload.id) {
    await prisma.reference.updateMany({ where: { id: payload.id, userId: user.id }, data })
  } else {
    await prisma.reference.create({ data })
  }

  revalidatePath('/dashboard')
}

export async function deleteReference(id: string) {
  const user = await getUser()
  if (!user) throw new Error('Não autenticado')

  await prisma.reference.deleteMany({ where: { id, userId: user.id } })
  revalidatePath('/dashboard')
}

// ── Currículo por ID ───────────────────────────────────────────────────────────

export async function getCurriculumById(id: string) {
  try {
    return await prisma.curriculum.findUnique({ where: { id } })
  } catch {
    return null
  }
}

// ── Dados Completos do CV por User ID ─────────────────────────────────────────

export async function getFullCVDataByUserId(userId: string) {
  const [
    profile,
    education,
    experiences,
    publications,
    projects,
    certifications,
    skills,
    languages,
    awards,
    references,
  ] = await Promise.all([
    prisma.profile.findUnique({ where: { id: userId } }),
    prisma.education.findMany({ where: { userId }, orderBy: [{ sortOrder: 'asc' }, { startDate: 'desc' }] }),
    prisma.experience.findMany({ where: { userId }, orderBy: [{ sortOrder: 'asc' }, { startDate: 'desc' }] }),
    prisma.publication.findMany({ where: { userId }, orderBy: [{ sortOrder: 'asc' }, { publicationDate: 'desc' }] }),
    prisma.project.findMany({ where: { userId }, orderBy: { sortOrder: 'asc' } }),
    prisma.certification.findMany({ where: { userId }, orderBy: { sortOrder: 'asc' } }),
    prisma.skill.findMany({ where: { userId }, orderBy: { sortOrder: 'asc' } }),
    prisma.language.findMany({ where: { userId }, orderBy: { sortOrder: 'asc' } }),
    prisma.award.findMany({ where: { userId }, orderBy: [{ sortOrder: 'asc' }, { awardDate: 'desc' }] }),
    prisma.reference.findMany({ where: { userId }, orderBy: { sortOrder: 'asc' } }),
  ])

  return {
    profile: profile ?? null,
    education,
    experiences,
    publications,
    projects,
    certifications,
    skills,
    languages,
    awards,
    references,
  }
}
