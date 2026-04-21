-- ═══════════════════════════════════════════════════════
-- MoPT-Map Database Setup — Run in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════

-- 1. App Data: Key-value store for all content sections
CREATE TABLE IF NOT EXISTS app_data (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Changelog: Audit trail for all admin actions
CREATE TABLE IF NOT EXISTS changelog (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  admin TEXT NOT NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  entity_title TEXT NOT NULL,
  changes JSONB NOT NULL DEFAULT '[]'
);

-- 3. Enable Row Level Security
ALTER TABLE app_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE changelog ENABLE ROW LEVEL SECURITY;

-- 4. Allow public read/write (admin auth is handled in-app)
CREATE POLICY "Allow public read app_data" ON app_data FOR SELECT USING (true);
CREATE POLICY "Allow public insert app_data" ON app_data FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update app_data" ON app_data FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete app_data" ON app_data FOR DELETE USING (true);

CREATE POLICY "Allow public read changelog" ON changelog FOR SELECT USING (true);
CREATE POLICY "Allow public insert changelog" ON changelog FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update changelog" ON changelog FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete changelog" ON changelog FOR DELETE USING (true);

-- 5. Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_app_data_updated_at
  BEFORE UPDATE ON app_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
