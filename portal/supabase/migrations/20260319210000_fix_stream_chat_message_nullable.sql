-- Fix: allow NULL message for media-only chat messages (images/videos without caption)
ALTER TABLE stream_chat_messages ALTER COLUMN message DROP NOT NULL;
