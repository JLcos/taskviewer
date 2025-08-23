import { supabase } from "@/integrations/supabase/client";
import { Task, TaskStatus } from "@/types/TaskTypes";

// Helpers: date and status mapping between DB and UI
const monthNames = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
];

const toDisplayDate = (iso?: string | null): string => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso; // already display format or invalid
  const day = d.getDate();
  const month = monthNames[d.getMonth()];
  return `${day} de ${month}`;
};

const toISODate = (value?: string): string | null => {
  if (!value) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value; // already ISO
  const parts = value.split(' de ');
  if (parts.length === 2) {
    const day = parseInt(parts[0], 10);
    const monthIndex = monthNames.indexOf(parts[1].toLowerCase());
    if (!isNaN(day) && monthIndex >= 0) {
      const year = new Date().getFullYear();
      const m = String(monthIndex + 1).padStart(2, '0');
      const dd = String(day).padStart(2, '0');
      return `${year}-${m}-${dd}`;
    }
  }
  return null;
};

type DbStatus = 'pendente' | 'em_andamento' | 'concluida';

const mapDbToUiStatus = (s: string): TaskStatus => {
  if (s === 'em_andamento') return 'em-andamento';
  if (s === 'concluida') return 'concluída';
  return 'pendente';
};

const mapUiToDbStatus = (s: TaskStatus): DbStatus => {
  if (s === 'em-andamento') return 'em_andamento';
  if (s === 'concluída') return 'concluida';
  return 'pendente';
};
export const getTasks = async (): Promise<Task[]> => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading tasks:', error);
      return [];
    }

    return data?.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description || '',
      discipline: task.discipline,
      status: mapDbToUiStatus(String(task.status)),
      dueDate: toDisplayDate(task.due_date)
    })) || [];
  } catch (error) {
    console.error('Error loading tasks from Supabase:', error);
    return [];
  }
};

// Add a new task
export const addTask = async (newTask: Omit<Task, 'id' | 'status'>) => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .insert([{
        title: newTask.title,
        description: newTask.description,
        discipline: newTask.discipline,
        status: 'pendente',
        due_date: toISODate(newTask.dueDate)
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding task:', error);
      throw error;
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description || '',
      discipline: data.discipline,
      status: mapDbToUiStatus(String(data.status)),
      dueDate: toDisplayDate(data.due_date)
    } as Task;
  } catch (error) {
    console.error('Error adding task to Supabase:', error);
    throw error;
  }
};

// Update a task
export const updateTask = async (id: string, updatedTask: Partial<Task>) => {
  try {
    const updateData: any = {};
    
    if (updatedTask.title !== undefined) updateData.title = updatedTask.title;
    if (updatedTask.description !== undefined) updateData.description = updatedTask.description;
    if (updatedTask.discipline !== undefined) updateData.discipline = updatedTask.discipline;
    if (updatedTask.status !== undefined) updateData.status = mapUiToDbStatus(updatedTask.status);
    if (updatedTask.dueDate !== undefined) updateData.due_date = toISODate(updatedTask.dueDate);

    const { error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error updating task in Supabase:', error);
    throw error;
  }
};

// Change task status
export const changeTaskStatus = async (id: string, status: TaskStatus) => {
  try {
    const { error } = await supabase
      .from('tasks')
      .update({ status: mapUiToDbStatus(status) })
      .eq('id', id);

    if (error) {
      console.error('Error changing task status:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error changing task status in Supabase:', error);
    throw error;
  }
};

// Delete a task
export const deleteTask = async (id: string) => {
  try {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error deleting task from Supabase:', error);
    throw error;
  }
};

// Subscribe to real-time task updates
export const subscribeToTasks = (callback: () => void) => {
  const channel = supabase
    .channel('tasks-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'tasks'
      },
      callback
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
