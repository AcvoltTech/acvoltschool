-- Chat Moderation: deleted column, bans table, moderators table
-- Run this in Supabase Dashboard SQL Editor

-- 1. Add deleted column to stream_chat_messages
ALTER TABLE stream_chat_messages ADD COLUMN IF NOT EXISTS deleted BOOLEAN DEFAULT false;

-- 2. RLS policy: allow anyone to UPDATE deleted flag on stream_chat_messages
-- (Admin/mod enforcement is done client-side; RLS just allows the UPDATE)
CREATE POLICY "Allow update deleted on stream_chat_messages"
  ON stream_chat_messages FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 3. Chat bans table
CREATE TABLE IF NOT EXISTS stream_chat_bans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stream_id UUID NOT NULL REFERENCES live_streams(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  user_name TEXT,
  banned_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(stream_id, user_email)
);

ALTER TABLE stream_chat_bans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on stream_chat_bans"
  ON stream_chat_bans FOR ALL
  USING (true)
  WITH CHECK (true);

-- 4. Moderators table
CREATE TABLE IF NOT EXISTS stream_moderators (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL,
  user_name TEXT,
  added_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_email)
);

ALTER TABLE stream_moderators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on stream_moderators"
  ON stream_moderators FOR ALL
  USING (true)
  WITH CHECK (true);
