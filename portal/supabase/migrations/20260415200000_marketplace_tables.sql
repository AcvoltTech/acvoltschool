-- ============================================
-- MAESTRO HVACR MARKETPLACE — P2P Classified Board
-- marketplace_sellers, marketplace_listings, marketplace_reviews, marketplace_reports
-- 2026-04-15
-- ============================================

-- Helper: get current user email from JWT
CREATE OR REPLACE FUNCTION _mp_email() RETURNS TEXT LANGUAGE SQL STABLE AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claims', true)::json->>'email',
    ''
  );
$$;

-- ============================================
-- 1. SELLERS — verification, TOS acceptance, tier
-- ============================================
CREATE TABLE IF NOT EXISTS marketplace_sellers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT UNIQUE NOT NULL,
  user_name TEXT,
  phone TEXT,
  -- Verification
  profile_photo_url TEXT,
  gov_id_url TEXT,
  gov_id_verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMPTZ,
  -- Legal
  tos_accepted BOOLEAN DEFAULT FALSE,
  tos_accepted_at TIMESTAMPTZ,
  nda_accepted BOOLEAN DEFAULT FALSE,
  nda_accepted_at TIMESTAMPTZ,
  -- Seller tier
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'paid', 'suspended')),
  stripe_payment_id TEXT,
  paid_at TIMESTAMPTZ,
  -- Stats
  total_listings INTEGER DEFAULT 0,
  total_sold INTEGER DEFAULT 0,
  avg_rating NUMERIC(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  -- Location
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  city TEXT,
  state TEXT,
  -- Meta
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mp_sellers_email ON marketplace_sellers (user_email);
CREATE INDEX IF NOT EXISTS idx_mp_sellers_tier ON marketplace_sellers (tier);
CREATE INDEX IF NOT EXISTS idx_mp_sellers_verified ON marketplace_sellers (gov_id_verified);

ALTER TABLE marketplace_sellers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read sellers" ON marketplace_sellers FOR SELECT USING (true);
CREATE POLICY "Users manage own seller profile" ON marketplace_sellers FOR INSERT WITH CHECK (user_email = _mp_email());
CREATE POLICY "Users update own seller profile" ON marketplace_sellers FOR UPDATE USING (user_email = _mp_email());

-- ============================================
-- 2. LISTINGS — products for sale
-- ============================================
CREATE TABLE IF NOT EXISTS marketplace_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_email TEXT NOT NULL REFERENCES marketplace_sellers(user_email),
  -- Product info
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  category TEXT NOT NULL DEFAULT 'general',
  condition TEXT NOT NULL DEFAULT 'used_good' CHECK (condition IN ('new', 'like_new', 'used_good', 'used_fair', 'for_parts')),
  -- Photos (up to 8)
  photos JSONB DEFAULT '[]'::jsonb,
  -- Location
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  -- Status
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'sold', 'removed', 'expired')),
  -- Analytics
  view_count INTEGER DEFAULT 0,
  message_count INTEGER DEFAULT 0,
  save_count INTEGER DEFAULT 0,
  -- Meta
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days')
);

CREATE INDEX IF NOT EXISTS idx_mp_listings_seller ON marketplace_listings (seller_email);
CREATE INDEX IF NOT EXISTS idx_mp_listings_status ON marketplace_listings (status);
CREATE INDEX IF NOT EXISTS idx_mp_listings_category ON marketplace_listings (category);
CREATE INDEX IF NOT EXISTS idx_mp_listings_created ON marketplace_listings (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mp_listings_price ON marketplace_listings (price);
CREATE INDEX IF NOT EXISTS idx_mp_listings_location ON marketplace_listings (latitude, longitude);

ALTER TABLE marketplace_listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read active listings" ON marketplace_listings FOR SELECT USING (
  status = 'active' OR seller_email = _mp_email()
);
CREATE POLICY "Verified sellers create listings" ON marketplace_listings FOR INSERT WITH CHECK (
  seller_email = _mp_email()
  AND EXISTS (SELECT 1 FROM marketplace_sellers WHERE user_email = _mp_email() AND tos_accepted = true AND gov_id_verified = true)
);
CREATE POLICY "Sellers update own listings" ON marketplace_listings FOR UPDATE USING (seller_email = _mp_email());
CREATE POLICY "Sellers delete own listings" ON marketplace_listings FOR DELETE USING (seller_email = _mp_email());

-- ============================================
-- 3. REVIEWS — mandatory after transaction
-- ============================================
CREATE TABLE IF NOT EXISTS marketplace_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES marketplace_listings(id) ON DELETE CASCADE,
  reviewer_email TEXT NOT NULL,
  reviewed_email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('buyer', 'seller')),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (listing_id, reviewer_email)
);

CREATE INDEX IF NOT EXISTS idx_mp_reviews_listing ON marketplace_reviews (listing_id);
CREATE INDEX IF NOT EXISTS idx_mp_reviews_reviewed ON marketplace_reviews (reviewed_email);
CREATE INDEX IF NOT EXISTS idx_mp_reviews_reviewer ON marketplace_reviews (reviewer_email);

ALTER TABLE marketplace_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read reviews" ON marketplace_reviews FOR SELECT USING (true);
CREATE POLICY "Users create own reviews" ON marketplace_reviews FOR INSERT WITH CHECK (reviewer_email = _mp_email());

-- ============================================
-- 4. REPORTS — flag bad listings
-- ============================================
CREATE TABLE IF NOT EXISTS marketplace_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES marketplace_listings(id) ON DELETE CASCADE,
  reporter_email TEXT NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN ('scam', 'stolen', 'prohibited', 'offensive', 'spam', 'other')),
  details TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'action_taken', 'dismissed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (listing_id, reporter_email)
);

CREATE INDEX IF NOT EXISTS idx_mp_reports_listing ON marketplace_reports (listing_id);
CREATE INDEX IF NOT EXISTS idx_mp_reports_status ON marketplace_reports (status);

ALTER TABLE marketplace_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users create own reports" ON marketplace_reports FOR INSERT WITH CHECK (reporter_email = _mp_email());
CREATE POLICY "Users read own reports" ON marketplace_reports FOR SELECT USING (reporter_email = _mp_email());

-- ============================================
-- 5. SAVED LISTINGS — favorites/bookmarks
-- ============================================
CREATE TABLE IF NOT EXISTS marketplace_saved (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  listing_id UUID NOT NULL REFERENCES marketplace_listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_email, listing_id)
);

ALTER TABLE marketplace_saved ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own saves" ON marketplace_saved FOR ALL USING (user_email = _mp_email());

-- ============================================
-- 6. VIEW TRACKING — increment view_count
-- ============================================
CREATE OR REPLACE FUNCTION mp_increment_views(p_listing_id UUID)
RETURNS VOID LANGUAGE SQL AS $$
  UPDATE marketplace_listings SET view_count = view_count + 1 WHERE id = p_listing_id;
$$;

-- ============================================
-- 7. MESSAGE COUNT — increment when WhatsApp clicked
-- ============================================
CREATE OR REPLACE FUNCTION mp_increment_messages(p_listing_id UUID)
RETURNS VOID LANGUAGE SQL AS $$
  UPDATE marketplace_listings SET message_count = message_count + 1 WHERE id = p_listing_id;
$$;

-- ============================================
-- 8. UPDATE SELLER STATS — trigger after review
-- ============================================
CREATE OR REPLACE FUNCTION mp_update_seller_stats()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE marketplace_sellers SET
    avg_rating = (SELECT ROUND(AVG(rating)::numeric, 2) FROM marketplace_reviews WHERE reviewed_email = NEW.reviewed_email),
    total_reviews = (SELECT COUNT(*) FROM marketplace_reviews WHERE reviewed_email = NEW.reviewed_email),
    updated_at = NOW()
  WHERE user_email = NEW.reviewed_email;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_mp_update_seller_stats
  AFTER INSERT ON marketplace_reviews
  FOR EACH ROW EXECUTE FUNCTION mp_update_seller_stats();

-- ============================================
-- 9. UPDATE LISTING COUNT — trigger after listing insert
-- ============================================
CREATE OR REPLACE FUNCTION mp_update_listing_count()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE marketplace_sellers SET
    total_listings = (SELECT COUNT(*) FROM marketplace_listings WHERE seller_email = NEW.seller_email),
    updated_at = NOW()
  WHERE user_email = NEW.seller_email;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_mp_update_listing_count
  AFTER INSERT ON marketplace_listings
  FOR EACH ROW EXECUTE FUNCTION mp_update_listing_count();

-- ============================================
-- 10. GRANTS
-- ============================================
GRANT SELECT, INSERT, UPDATE ON marketplace_sellers TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON marketplace_listings TO authenticated;
GRANT SELECT, INSERT ON marketplace_reviews TO authenticated;
GRANT SELECT, INSERT ON marketplace_reports TO authenticated;
GRANT ALL ON marketplace_saved TO authenticated;
GRANT EXECUTE ON FUNCTION mp_increment_views TO authenticated;
GRANT EXECUTE ON FUNCTION mp_increment_messages TO authenticated;
