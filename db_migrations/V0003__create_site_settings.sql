CREATE TABLE IF NOT EXISTS site_settings (
  key VARCHAR(64) PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO site_settings (key, value) VALUES
  ('phone', '+7 (800) 000-00-00'),
  ('email', 'hello@artstage.pro'),
  ('address', 'Москва, ул. Тверская, 12'),
  ('instagram', ''),
  ('telegram', ''),
  ('youtube', ''),
  ('vk', ''),
  ('whatsapp', '')
ON CONFLICT (key) DO NOTHING;
