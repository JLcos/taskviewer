-- Add user_id to tasks table and implement proper RLS policies
ALTER TABLE public.tasks ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update existing tasks to have a placeholder user_id (they will need to be recreated by authenticated users)
-- For now, we'll just allow the migration to complete and handle data migration separately

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Public access to tasks" ON public.tasks;

-- Create user-specific RLS policies
CREATE POLICY "Users can view their own tasks" 
ON public.tasks 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tasks" 
ON public.tasks 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks" 
ON public.tasks 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks" 
ON public.tasks 
FOR DELETE 
USING (auth.uid() = user_id);

-- Also update disciplines table to be user-specific
ALTER TABLE public.disciplines ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop the existing overly permissive policy for disciplines
DROP POLICY IF EXISTS "Public access to disciplines" ON public.disciplines;

-- Create user-specific RLS policies for disciplines  
CREATE POLICY "Users can view their own disciplines" 
ON public.disciplines 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own disciplines" 
ON public.disciplines 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own disciplines" 
ON public.disciplines 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own disciplines" 
ON public.disciplines 
FOR DELETE 
USING (auth.uid() = user_id);