// =====================================================
// TIPOS DE BASE DE DADOS — CurriculumAI
// Gerado via: npm run db:types
// =====================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type AcademicLevel =
  | 'licenciatura'
  | 'mestrado'
  | 'doutoramento'
  | 'pos_doutoramento'
  | 'professor'
  | 'investigador'
  | 'outro'

export type ProficiencyLevel =
  | 'basico'
  | 'intermediario'
  | 'avancado'
  | 'especialista'

export type TemplateType = 'academic' | 'research' | 'industry' | 'minimal'

export interface Database {
  curriculumai: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          email: string
          phone: string | null
          nationality: string | null
          birth_date: string | null
          institution: string | null
          department: string | null
          academic_level: AcademicLevel | null
          bio: string | null
          profile_photo: string | null
          linkedin_url: string | null
          orcid_id: string | null
          website_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['curriculumai']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'> & {
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['curriculumai']['Tables']['profiles']['Insert']>
      }
      curriculums: {
        Row: {
          id: string
          user_id: string
          title: string
          summary: string | null
          template_name: TemplateType
          language: string
          ai_generated: boolean
          is_public: boolean
          is_default: boolean
          view_count: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['curriculumai']['Tables']['curriculums']['Row'], 'id' | 'created_at' | 'updated_at' | 'view_count'> & {
          id?: string
          created_at?: string
          updated_at?: string
          view_count?: number
        }
        Update: Partial<Database['curriculumai']['Tables']['curriculums']['Insert']>
      }
      education: {
        Row: {
          id: string
          user_id: string
          institution: string
          degree: string
          field_of_study: string | null
          start_date: string | null
          end_date: string | null
          is_current: boolean
          grade: string | null
          description: string | null
          sort_order: number
          created_at: string
        }
        Insert: Omit<Database['curriculumai']['Tables']['education']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['curriculumai']['Tables']['education']['Insert']>
      }
      experiences: {
        Row: {
          id: string
          user_id: string
          organization: string
          role: string
          location: string | null
          start_date: string | null
          end_date: string | null
          is_current: boolean
          description: string | null
          sort_order: number
          created_at: string
        }
        Insert: Omit<Database['curriculumai']['Tables']['experiences']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['curriculumai']['Tables']['experiences']['Insert']>
      }
      publications: {
        Row: {
          id: string
          user_id: string
          title: string
          authors: string | null
          journal: string | null
          publication_date: string | null
          doi: string | null
          url: string | null
          abstract: string | null
          pub_type: string
          sort_order: number
          created_at: string
        }
        Insert: Omit<Database['curriculumai']['Tables']['publications']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['curriculumai']['Tables']['publications']['Insert']>
      }
      projects: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          role: string | null
          start_date: string | null
          end_date: string | null
          is_current: boolean
          funding_entity: string | null
          budget: number | null
          url: string | null
          sort_order: number
          created_at: string
        }
        Insert: Omit<Database['curriculumai']['Tables']['projects']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['curriculumai']['Tables']['projects']['Insert']>
      }
      certifications: {
        Row: {
          id: string
          user_id: string
          name: string
          issuing_organization: string | null
          issue_date: string | null
          expiry_date: string | null
          credential_id: string | null
          credential_url: string | null
          sort_order: number
          created_at: string
        }
        Insert: Omit<Database['curriculumai']['Tables']['certifications']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['curriculumai']['Tables']['certifications']['Insert']>
      }
      skills: {
        Row: {
          id: string
          user_id: string
          skill_name: string
          category: string | null
          proficiency_level: ProficiencyLevel | null
          sort_order: number
          created_at: string
        }
        Insert: Omit<Database['curriculumai']['Tables']['skills']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['curriculumai']['Tables']['skills']['Insert']>
      }
      languages: {
        Row: {
          id: string
          user_id: string
          language: string
          proficiency: string
          sort_order: number
          created_at: string
        }
        Insert: Omit<Database['curriculumai']['Tables']['languages']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['curriculumai']['Tables']['languages']['Insert']>
      }
      awards: {
        Row: {
          id: string
          user_id: string
          title: string
          issuer: string | null
          award_date: string | null
          description: string | null
          sort_order: number
          created_at: string
        }
        Insert: Omit<Database['curriculumai']['Tables']['awards']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['curriculumai']['Tables']['awards']['Insert']>
      }
      references: {
        Row: {
          id: string
          user_id: string
          name: string
          title: string | null
          organization: string | null
          email: string | null
          phone: string | null
          is_visible: boolean
          sort_order: number
          created_at: string
        }
        Insert: Omit<Database['curriculumai']['Tables']['references']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['curriculumai']['Tables']['references']['Insert']>
      }
      generated_cvs: {
        Row: {
          id: string
          user_id: string
          curriculum_id: string
          file_url: string | null
          file_size_bytes: number | null
          generated_by_ai: boolean
          expires_at: string | null
          created_at: string
        }
        Insert: Omit<Database['curriculumai']['Tables']['generated_cvs']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['curriculumai']['Tables']['generated_cvs']['Insert']>
      }
      ai_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          prompt: string | null
          response: string | null
          model: string
          tokens_used: number | null
          duration_ms: number | null
          created_at: string
        }
        Insert: Omit<Database['curriculumai']['Tables']['ai_logs']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['curriculumai']['Tables']['ai_logs']['Insert']>
      }
    }
  }
}

// Aliases convenientes
export type Profile = Database['curriculumai']['Tables']['profiles']['Row']
export type Curriculum = Database['curriculumai']['Tables']['curriculums']['Row']
export type Education = Database['curriculumai']['Tables']['education']['Row']
export type Experience = Database['curriculumai']['Tables']['experiences']['Row']
export type Publication = Database['curriculumai']['Tables']['publications']['Row']
export type Skill = Database['curriculumai']['Tables']['skills']['Row']
export type Award = Database['curriculumai']['Tables']['awards']['Row']
export type Project = Database['curriculumai']['Tables']['projects']['Row']
export type Certification = Database['curriculumai']['Tables']['certifications']['Row']
export type Language = Database['curriculumai']['Tables']['languages']['Row']
export type Reference = Database['curriculumai']['Tables']['references']['Row']
export type GeneratedCV = Database['curriculumai']['Tables']['generated_cvs']['Row']
export type AILog = Database['curriculumai']['Tables']['ai_logs']['Row']
