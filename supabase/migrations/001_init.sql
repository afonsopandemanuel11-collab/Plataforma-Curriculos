-- =====================================================
-- CurriculumAI — Schema v1.0
-- Plataforma inteligente de currículos académicos
-- =====================================================

-- =====================================================
-- SCHEMA & EXTENSÕES
-- =====================================================

CREATE SCHEMA IF NOT EXISTS curriculumai;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ENUMS
-- =====================================================

CREATE TYPE curriculumai.academic_level_enum AS ENUM (
  'licenciatura',
  'mestrado',
  'doutoramento',
  'pos_doutoramento',
  'professor',
  'investigador',
  'outro'
);

CREATE TYPE curriculumai.proficiency_level_enum AS ENUM (
  'basico',
  'intermediario',
  'avancado',
  'especialista'
);

CREATE TYPE curriculumai.template_enum AS ENUM (
  'academic',
  'research',
  'industry',
  'minimal'
);

-- =====================================================
-- PERFIL DO UTILIZADOR
-- =====================================================

CREATE TABLE curriculumai.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     TEXT NOT NULL,
  email         TEXT UNIQUE NOT NULL,
  phone         TEXT,
  nationality   TEXT,
  birth_date    DATE,
  institution   TEXT,
  department    TEXT,
  academic_level curriculumai.academic_level_enum,
  bio           TEXT,
  profile_photo TEXT,
  linkedin_url  TEXT,
  orcid_id      TEXT,
  website_url   TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE curriculumai.profiles IS 'Perfil principal de cada utilizador registado.';

-- =====================================================
-- CURRÍCULOS
-- =====================================================

CREATE TABLE curriculumai.curriculums (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES curriculumai.profiles(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  summary       TEXT,
  template_name curriculumai.template_enum NOT NULL DEFAULT 'academic',
  language      TEXT NOT NULL DEFAULT 'pt',
  ai_generated  BOOLEAN NOT NULL DEFAULT FALSE,
  is_public     BOOLEAN NOT NULL DEFAULT FALSE,
  is_default    BOOLEAN NOT NULL DEFAULT FALSE,
  view_count    INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE curriculumai.curriculums IS 'Currículos criados por cada utilizador.';

-- =====================================================
-- FORMAÇÃO ACADÉMICA
-- =====================================================

CREATE TABLE curriculumai.education (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES curriculumai.profiles(id) ON DELETE CASCADE,
  institution    TEXT NOT NULL,
  degree         TEXT NOT NULL,
  field_of_study TEXT,
  start_date     DATE,
  end_date       DATE,
  is_current     BOOLEAN NOT NULL DEFAULT FALSE,
  grade          TEXT,
  description    TEXT,
  sort_order     INTEGER NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- EXPERIÊNCIA PROFISSIONAL
-- =====================================================

CREATE TABLE curriculumai.experiences (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES curriculumai.profiles(id) ON DELETE CASCADE,
  organization TEXT NOT NULL,
  role         TEXT NOT NULL,
  location     TEXT,
  start_date   DATE,
  end_date     DATE,
  is_current   BOOLEAN NOT NULL DEFAULT FALSE,
  description  TEXT,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- PUBLICAÇÕES
-- =====================================================

CREATE TABLE curriculumai.publications (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL REFERENCES curriculumai.profiles(id) ON DELETE CASCADE,
  title            TEXT NOT NULL,
  authors          TEXT,
  journal          TEXT,
  publication_date DATE,
  doi              TEXT,
  url              TEXT,
  abstract         TEXT,
  pub_type         TEXT NOT NULL DEFAULT 'article',
  sort_order       INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- PROJETOS
-- =====================================================

CREATE TABLE curriculumai.projects (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES curriculumai.profiles(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  description     TEXT,
  role            TEXT,
  start_date      DATE,
  end_date        DATE,
  is_current      BOOLEAN NOT NULL DEFAULT FALSE,
  funding_entity  TEXT,
  budget          NUMERIC(14, 2),
  url             TEXT,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- CERTIFICAÇÕES
-- =====================================================

CREATE TABLE curriculumai.certifications (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id              UUID NOT NULL REFERENCES curriculumai.profiles(id) ON DELETE CASCADE,
  name                 TEXT NOT NULL,
  issuing_organization TEXT,
  issue_date           DATE,
  expiry_date          DATE,
  credential_id        TEXT,
  credential_url       TEXT,
  sort_order           INTEGER NOT NULL DEFAULT 0,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- COMPETÊNCIAS
-- =====================================================

CREATE TABLE curriculumai.skills (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL REFERENCES curriculumai.profiles(id) ON DELETE CASCADE,
  skill_name       TEXT NOT NULL,
  category         TEXT,
  proficiency_level curriculumai.proficiency_level_enum,
  sort_order       INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- IDIOMAS
-- =====================================================

CREATE TABLE curriculumai.languages (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES curriculumai.profiles(id) ON DELETE CASCADE,
  language    TEXT NOT NULL,
  proficiency TEXT NOT NULL DEFAULT 'intermediario',
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- PRÉMIOS & DISTINÇÕES
-- =====================================================

CREATE TABLE curriculumai.awards (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES curriculumai.profiles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  issuer      TEXT,
  award_date  DATE,
  description TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- REFERÊNCIAS
-- =====================================================

CREATE TABLE curriculumai.references (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES curriculumai.profiles(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  title        TEXT,
  organization TEXT,
  email        TEXT,
  phone        TEXT,
  is_visible   BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- CURRÍCULOS GERADOS (PDFs)
-- =====================================================

CREATE TABLE curriculumai.generated_cvs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES curriculumai.profiles(id) ON DELETE CASCADE,
  curriculum_id   UUID NOT NULL REFERENCES curriculumai.curriculums(id) ON DELETE CASCADE,
  file_url        TEXT,
  file_size_bytes INTEGER,
  generated_by_ai BOOLEAN NOT NULL DEFAULT TRUE,
  expires_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- LOGS DA IA
-- =====================================================

CREATE TABLE curriculumai.ai_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES curriculumai.profiles(id) ON DELETE SET NULL,
  action      TEXT NOT NULL,
  prompt      TEXT,
  response    TEXT,
  model       TEXT NOT NULL DEFAULT 'claude-sonnet-4-20250514',
  tokens_used INTEGER,
  duration_ms INTEGER,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- FUNÇÕES E TRIGGERS
-- =====================================================

-- Atualiza updated_at automaticamente
CREATE OR REPLACE FUNCTION curriculumai.update_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON curriculumai.profiles
  FOR EACH ROW EXECUTE FUNCTION curriculumai.update_timestamp();

CREATE TRIGGER trg_curriculums_updated_at
  BEFORE UPDATE ON curriculumai.curriculums
  FOR EACH ROW EXECUTE FUNCTION curriculumai.update_timestamp();

-- Cria perfil automaticamente após registo
CREATE OR REPLACE FUNCTION curriculumai.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = curriculumai, public
AS $$
BEGIN
  INSERT INTO curriculumai.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION curriculumai.handle_new_user();

-- Garante que só existe 1 currículo padrão por utilizador
CREATE OR REPLACE FUNCTION curriculumai.enforce_single_default_cv()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.is_default = TRUE THEN
    UPDATE curriculumai.curriculums
    SET is_default = FALSE
    WHERE user_id = NEW.user_id
      AND id <> NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_single_default_cv
  BEFORE INSERT OR UPDATE ON curriculumai.curriculums
  FOR EACH ROW EXECUTE FUNCTION curriculumai.enforce_single_default_cv();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE curriculumai.profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculumai.curriculums    ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculumai.education      ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculumai.experiences    ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculumai.publications   ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculumai.projects       ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculumai.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculumai.skills         ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculumai.languages      ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculumai.awards         ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculumai.references     ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculumai.generated_cvs  ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculumai.ai_logs        ENABLE ROW LEVEL SECURITY;

-- Políticas: utilizador acede apenas aos seus próprios dados
CREATE POLICY "own_profile"        ON curriculumai.profiles       FOR ALL USING (auth.uid() = id);
CREATE POLICY "own_curriculums"    ON curriculumai.curriculums    FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_education"      ON curriculumai.education      FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_experiences"    ON curriculumai.experiences    FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_publications"   ON curriculumai.publications   FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_projects"       ON curriculumai.projects       FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_certifications" ON curriculumai.certifications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_skills"         ON curriculumai.skills         FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_languages"      ON curriculumai.languages      FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_awards"         ON curriculumai.awards         FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_references"     ON curriculumai.references     FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_generated_cvs"  ON curriculumai.generated_cvs  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_ai_logs"        ON curriculumai.ai_logs        FOR ALL USING (auth.uid() = user_id);

-- Currículos públicos visíveis a todos (leitura)
CREATE POLICY "public_curriculums_read"
  ON curriculumai.curriculums
  FOR SELECT
  USING (is_public = TRUE);

-- =====================================================
-- ÍNDICES
-- =====================================================

CREATE INDEX idx_curriculums_user_id       ON curriculumai.curriculums(user_id);
CREATE INDEX idx_curriculums_is_public     ON curriculumai.curriculums(is_public) WHERE is_public = TRUE;
CREATE INDEX idx_education_user_id         ON curriculumai.education(user_id);
CREATE INDEX idx_experiences_user_id       ON curriculumai.experiences(user_id);
CREATE INDEX idx_publications_user_id      ON curriculumai.publications(user_id);
CREATE INDEX idx_projects_user_id          ON curriculumai.projects(user_id);
CREATE INDEX idx_certifications_user_id    ON curriculumai.certifications(user_id);
CREATE INDEX idx_skills_user_id            ON curriculumai.skills(user_id);
CREATE INDEX idx_awards_user_id            ON curriculumai.awards(user_id);
CREATE INDEX idx_generated_cvs_user_id     ON curriculumai.generated_cvs(user_id);
CREATE INDEX idx_generated_cvs_curriculum  ON curriculumai.generated_cvs(curriculum_id);
CREATE INDEX idx_ai_logs_user_id           ON curriculumai.ai_logs(user_id);
CREATE INDEX idx_ai_logs_created_at        ON curriculumai.ai_logs(created_at DESC);
