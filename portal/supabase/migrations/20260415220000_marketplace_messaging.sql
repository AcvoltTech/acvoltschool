-- Marketplace messaging, calls, and conversation tracking

-- ── Conversations (one per buyer-listing pair) ─────────────────
CREATE TABLE IF NOT EXISTS marketplace_conversations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id uuid REFERENCES marketplace_listings(id) ON DELETE CASCADE,
  buyer_email text NOT NULL,
  seller_email text NOT NULL,
  last_message text,
  last_message_at timestamptz,
  buyer_unread int DEFAULT 0,
  seller_unread int DEFAULT 0,
  hms_room_id text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(listing_id, buyer_email)
);

-- ── Messages ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS marketplace_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id uuid REFERENCES marketplace_conversations(id) ON DELETE CASCADE,
  sender_email text NOT NULL,
  message text NOT NULL,
  message_type text DEFAULT 'text',
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- ── Call history ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS marketplace_calls (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id uuid REFERENCES marketplace_conversations(id) ON DELETE CASCADE,
  caller_email text NOT NULL,
  receiver_email text NOT NULL,
  hms_room_id text,
  duration_seconds int DEFAULT 0,
  status text DEFAULT 'initiated',
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz
);

-- ── Indexes ────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_mp_conv_buyer ON marketplace_conversations(buyer_email);
CREATE INDEX IF NOT EXISTS idx_mp_conv_seller ON marketplace_conversations(seller_email);
CREATE INDEX IF NOT EXISTS idx_mp_conv_listing ON marketplace_conversations(listing_id);
CREATE INDEX IF NOT EXISTS idx_mp_msg_conv ON marketplace_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_mp_msg_created ON marketplace_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_mp_calls_conv ON marketplace_calls(conversation_id);

-- ── RLS ────────────────────────────────────────────────────────
ALTER TABLE marketplace_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_calls ENABLE ROW LEVEL SECURITY;

-- Conversations: participants can read/create
CREATE POLICY mp_conv_select ON marketplace_conversations FOR SELECT
  USING (_mp_email() IN (buyer_email, seller_email));

CREATE POLICY mp_conv_insert ON marketplace_conversations FOR INSERT
  WITH CHECK (_mp_email() = buyer_email);

CREATE POLICY mp_conv_update ON marketplace_conversations FOR UPDATE
  USING (_mp_email() IN (buyer_email, seller_email));

-- Messages: participants can read; sender can insert
CREATE POLICY mp_msg_select ON marketplace_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM marketplace_conversations c
      WHERE c.id = conversation_id
        AND _mp_email() IN (c.buyer_email, c.seller_email)
    )
  );

CREATE POLICY mp_msg_insert ON marketplace_messages FOR INSERT
  WITH CHECK (
    _mp_email() = sender_email
    AND EXISTS (
      SELECT 1 FROM marketplace_conversations c
      WHERE c.id = conversation_id
        AND _mp_email() IN (c.buyer_email, c.seller_email)
    )
  );

-- Messages: sender can update read status
CREATE POLICY mp_msg_update ON marketplace_messages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM marketplace_conversations c
      WHERE c.id = conversation_id
        AND _mp_email() IN (c.buyer_email, c.seller_email)
    )
  );

-- Calls: participants can read/insert
CREATE POLICY mp_calls_select ON marketplace_calls FOR SELECT
  USING (_mp_email() IN (caller_email, receiver_email));

CREATE POLICY mp_calls_insert ON marketplace_calls FOR INSERT
  WITH CHECK (_mp_email() = caller_email);

CREATE POLICY mp_calls_update ON marketplace_calls FOR UPDATE
  USING (_mp_email() IN (caller_email, receiver_email));

-- ── Trigger: update conversation on new message ────────────────
CREATE OR REPLACE FUNCTION _mp_update_conv_on_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE marketplace_conversations SET
    last_message = NEW.message,
    last_message_at = NEW.created_at,
    buyer_unread = CASE
      WHEN NEW.sender_email = seller_email THEN buyer_unread + 1
      ELSE buyer_unread END,
    seller_unread = CASE
      WHEN NEW.sender_email = buyer_email THEN seller_unread + 1
      ELSE seller_unread END
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_mp_conv_on_message
  AFTER INSERT ON marketplace_messages
  FOR EACH ROW EXECUTE FUNCTION _mp_update_conv_on_message();

-- ── Function: mark messages as read ────────────────────────────
CREATE OR REPLACE FUNCTION mp_mark_read(p_conversation_id uuid, p_reader_email text)
RETURNS void AS $$
BEGIN
  UPDATE marketplace_messages
    SET read = true
    WHERE conversation_id = p_conversation_id
      AND sender_email != p_reader_email
      AND read = false;
  -- Reset unread counter
  UPDATE marketplace_conversations SET
    buyer_unread = CASE WHEN buyer_email = p_reader_email THEN 0 ELSE buyer_unread END,
    seller_unread = CASE WHEN seller_email = p_reader_email THEN 0 ELSE seller_unread END
  WHERE id = p_conversation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
