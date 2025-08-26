-- Security Fix: Handle orphaned data and strengthen database constraints

-- Step 1: Remove orphaned data that cannot be associated with any user
DELETE FROM tasks WHERE user_id IS NULL;
DELETE FROM disciplines WHERE user_id IS NULL;

-- Step 2: Add NOT NULL constraints to prevent future orphaned data
ALTER TABLE tasks ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE disciplines ALTER COLUMN user_id SET NOT NULL;

-- Step 3: Fix function security - add proper search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Step 4: Add database-level constraints for input validation
ALTER TABLE tasks ADD CONSTRAINT tasks_title_length CHECK (char_length(title) <= 255);
ALTER TABLE tasks ADD CONSTRAINT tasks_description_length CHECK (char_length(description) <= 1000);
ALTER TABLE disciplines ADD CONSTRAINT disciplines_name_length CHECK (char_length(name) <= 100);

-- Step 5: Add indexes for security-related queries
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_disciplines_user_id ON disciplines(user_id);