
import { Task, TaskStatus } from "@/types/TaskTypes";

// Storage keys
const TASKS_STORAGE_KEY = 'task-viewer-tasks';

// Callbacks for real-time updates
type UpdateCallback = () => void;
const updateCallbacks: UpdateCallback[] = [];

// Initialize event listener for cross-tab updates
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === TASKS_STORAGE_KEY) {
      // Notify all registered callbacks when storage changes
      notifyUpdates();
    }
  });
}

// Register a component to receive updates
export const registerForUpdates = (callback: UpdateCallback) => {
  updateCallbacks.push(callback);
  return () => {
    const index = updateCallbacks.indexOf(callback);
    if (index > -1) {
      updateCallbacks.splice(index, 1);
    }
  };
};

// Notify all registered components
const notifyUpdates = () => {
  updateCallbacks.forEach(callback => callback());
};

// Get all tasks
export const getTasks = (): Task[] => {
  try {
    const savedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
    return savedTasks ? JSON.parse(savedTasks) : [];
  } catch (error) {
    console.error('Error loading tasks from storage:', error);
    return [];
  }
};

// Save tasks
export const saveTasks = (tasks: Task[]) => {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    
    // Dispatch a custom event for real-time updates within the same tab
    const event = new Event('local-storage-updated');
    window.dispatchEvent(event);
    
    notifyUpdates();
  } catch (error) {
    console.error('Error saving tasks to storage:', error);
  }
};

// Add a new task
export const addTask = (newTask: Omit<Task, 'id' | 'status'>) => {
  const tasks = getTasks();
  const taskToAdd: Task = {
    id: Date.now().toString(),
    title: newTask.title,
    description: newTask.description,
    discipline: newTask.discipline,
    status: "pendente",
    dueDate: newTask.dueDate
  };
  
  tasks.push(taskToAdd);
  saveTasks(tasks);
  return taskToAdd;
};

// Update a task
export const updateTask = (id: string, updatedTask: Partial<Task>) => {
  const tasks = getTasks();
  const updatedTasks = tasks.map(task => 
    task.id === id ? { ...task, ...updatedTask } : task
  );
  
  saveTasks(updatedTasks);
};

// Change task status
export const changeTaskStatus = (id: string, status: TaskStatus) => {
  const tasks = getTasks();
  const updatedTasks = tasks.map(task => 
    task.id === id ? { ...task, status } : task
  );
  
  saveTasks(updatedTasks);
};

// Delete a task
export const deleteTask = (id: string) => {
  const tasks = getTasks();
  const filteredTasks = tasks.filter(task => task.id !== id);
  
  saveTasks(filteredTasks);
};
