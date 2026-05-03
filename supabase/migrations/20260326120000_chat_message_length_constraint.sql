-- Enforce max message length at database level (client-side maxlength=500 can be bypassed)
-- Only add if constraint doesn't already exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'chat_messages_content_length'
  ) THEN
    ALTER TABLE chat_messages ADD CONSTRAINT chat_messages_content_length
      CHECK (char_length(content) <= 1000);
  END IF;
END $$;
