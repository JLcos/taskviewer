-- Drop existing RLS policies that require authentication
DROP POLICY IF EXISTS "Users can view their own disciplines" ON public.disciplines;
DROP POLICY IF EXISTS "Users can create their own disciplines" ON public.disciplines;
DROP POLICY IF EXISTS "Users can update their own disciplines" ON public.disciplines;
DROP POLICY IF EXISTS "Users can delete their own disciplines" ON public.disciplines;

DROP POLICY IF EXISTS "Users can view their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can create their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can update their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete their own tasks" ON public.tasks;

-- Create new policies that allow access for the default user ID
CREATE POLICY "Allow access to disciplines for default user" 
ON public.disciplines 
FOR ALL 
USING (user_id = '00000000-0000-0000-0000-000000000000'::uuid)
WITH CHECK (user_id = '00000000-0000-0000-0000-000000000000'::uuid);

CREATE POLICY "Allow access to tasks for default user" 
ON public.tasks 
FOR ALL 
USING (user_id = '00000000-0000-0000-0000-000000000000'::uuid)
WITH CHECK (user_id = '00000000-0000-0000-0000-000000000000'::uuid);