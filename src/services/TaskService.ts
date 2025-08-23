
import { supabase } from "@/integrations/supabase/client";
import { Task, TaskStatus } from "@/types/TaskTypes";

// Get all tasks
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
      status: task.status as TaskStatus,
      dueDate: task.due_date || undefined
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
        due_date: newTask.dueDate
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
      status: data.status as TaskStatus,
      dueDate: data.due_date || undefined
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
    if (updatedTask.status !== undefined) updateData.status = updatedTask.status;
    if (updatedTask.dueDate !== undefined) updateData.due_date = updatedTask.dueDate;

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
      .update({ status })
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
