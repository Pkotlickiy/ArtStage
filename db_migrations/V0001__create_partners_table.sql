CREATE TABLE IF NOT EXISTS partners (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(255) NOT NULL,
  logo VARCHAR(10) NOT NULL DEFAULT '🏢',
  logo_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO partners (name, description, logo, sort_order) VALUES
  ('BrandCo', 'Стратегический партнёр', '🏢', 1),
  ('MediaMax', 'Медиа-производство', '📡', 2),
  ('LightPro', 'Световое оборудование', '💡', 3),
  ('SoundWave', 'Звуковые технологии', '🎵', 4),
  ('TechVision', 'Видеопроизводство', '🎬', 5),
  ('FlowerArt', 'Флористика и декор', '🌸', 6);
