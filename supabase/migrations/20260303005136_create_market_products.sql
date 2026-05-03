-- ============================================
-- ACVOLT Market - Productos del Mercado
-- Fecha: Marzo 2, 2026
-- ============================================

-- Tabla de productos del mercado ACVOLT
CREATE TABLE IF NOT EXISTS market_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  categoria TEXT NOT NULL DEFAULT 'general',
  imagen_url TEXT,
  estado TEXT DEFAULT 'activo',
  enlace_externo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_market_products_categoria ON market_products(categoria);
CREATE INDEX IF NOT EXISTS idx_market_products_estado ON market_products(estado);

-- RLS
ALTER TABLE market_products ENABLE ROW LEVEL SECURITY;

-- Todos pueden ver productos activos
CREATE POLICY "Public read" ON market_products FOR SELECT USING (true);

-- Admin puede insertar, actualizar y eliminar
CREATE POLICY "Admin insert" ON market_products FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin update" ON market_products FOR UPDATE USING (true);
CREATE POLICY "Admin delete" ON market_products FOR DELETE USING (true);
