-- =====================================================
-- CurriculumAI — Auth Compatibility Schema
-- =====================================================

CREATE SCHEMA IF NOT EXISTS auth;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de utilizadores locais equivalente à do Supabase Auth
CREATE TABLE auth.users (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email               TEXT UNIQUE NOT NULL,
  password_hash       TEXT NOT NULL,
  raw_user_meta_data  JSONB DEFAULT '{}'::jsonb,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Função de compatibilidade auth.uid() para evitar erros nas RLS
CREATE OR REPLACE FUNCTION auth.uid()
RETURNS UUID
LANGUAGE plpgsql
AS $$
BEGIN
  -- Nas queries locais por Server Actions o RLS é contornado,
  -- pelo que esta função serve apenas para compatibilidade de schema.
  RETURN NULL;
END;
$$;
