import { supabase } from "@/integrations/supabase/client";
import { validateDisciplineName, checkRateLimit } from "@/lib/validation";

export interface Discipline {
  id: string;
  name: string;
}

// Get all disciplines
export const getDisciplines = async (userId: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('disciplines')
      .select('name')
      .eq('user_id', userId)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error loading disciplines:', error);
      return [];
    }

    return data?.map(d => d.name) || [];
  } catch (error) {
    console.error('Error loading disciplines from Supabase:', error);
    return [];
  }
};

// Add a new discipline
export const addDiscipline = async (name: string, userId: string) => {
  try {
    // Rate limiting check
    if (!checkRateLimit(`addDiscipline_${userId}`, 10, 60000)) {
      throw new Error('Muitas tentativas. Tente novamente em alguns minutos.');
    }

    // Validate and sanitize input
    const validation = validateDisciplineName(name);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const { error } = await supabase
      .from('disciplines')
      .insert([{ name: validation.sanitized, user_id: userId }]);

    if (error) {
      console.error('Error adding discipline:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error adding discipline to Supabase:', error);
    throw error;
  }
};

// Update a discipline
export const updateDiscipline = async (oldName: string, newName: string) => {
  try {
    // Validate and sanitize input
    const validation = validateDisciplineName(newName);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Start a transaction to update both disciplines and tasks
    const { error: disciplineError } = await supabase
      .from('disciplines')
      .update({ name: validation.sanitized })
      .eq('name', oldName);

    if (disciplineError) {
      console.error('Error updating discipline:', disciplineError);
      throw disciplineError;
    }

    // Update all tasks with the old discipline name
    const { error: tasksError } = await supabase
      .from('tasks')
      .update({ discipline: validation.sanitized })
      .eq('discipline', oldName);

    if (tasksError) {
      console.error('Error updating tasks with new discipline:', tasksError);
      throw tasksError;
    }
  } catch (error) {
    console.error('Error updating discipline in Supabase:', error);
    throw error;
  }
};

// Delete a discipline
export const deleteDiscipline = async (name: string) => {
  try {
    const { error } = await supabase
      .from('disciplines')
      .delete()
      .eq('name', name);

    if (error) {
      console.error('Error deleting discipline:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error deleting discipline from Supabase:', error);
    throw error;
  }
};

// Subscribe to real-time discipline updates
export const subscribeToDisciplines = (callback: () => void) => {
  const channel = supabase
    .channel('disciplines-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'disciplines'
      },
      callback
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};