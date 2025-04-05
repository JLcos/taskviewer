
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { TaskCard } from "@/components/TaskCard";
import { CreateTaskDialog } from "@/components/CreateTaskDialog";
import { useToast } from "@/hooks/use-toast";
import { Task, TaskStatus } from "@/types/TaskTypes";
import { motion } from "framer-motion";
import { CalendarIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

// Storage key for tasks
const TASKS_STORAGE_KEY = 'task-viewer-tasks';

const Calendar = ({ 
  disciplines,
  onAddDiscipline,
  onEditDiscipline,
  onDeleteDiscipline
}: {
  disciplines: string[];
  onAddDiscipline: (name: string) => void;
  onEditDiscipline: (oldName: string, newName: string) => void;
  onDeleteDiscipline: (name: string) => void;
}) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  
  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);
  
  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);
  
  // Format the selected date to match the task dueDate format
  const formatSelectedDate = (date: Date | undefined): string => {
    if (!date) return "";
    
    const day = date.getDate();
    const monthNames = [
      "janeiro", "fevereiro", "março", "abril", "maio", "junho",
      "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
    ];
    const month = monthNames[date.getMonth()];
    
    return `${day} de ${month}`;
  };
  
  // Filter tasks by both date and search term
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = searchTerm === "" || 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.discipline.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by selected date
    const selectedDateFormatted = formatSelectedDate(date);
    const matchesDate = selectedDateFormatted === "" || task.dueDate === selectedDateFormatted;
    
    return matchesSearch && matchesDate;
  });
  
  // Handle task creation
  const handleCreateTask = (newTask: any) => {
    const taskToAdd: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      discipline: newTask.discipline,
      status: "pendente",
      dueDate: formatDate(newTask.dueDate),
    };
    
    setTasks(prevTasks => [...prevTasks, taskToAdd]);
    
    toast({
      title: "Tarefa criada",
      description: "A tarefa foi criada com sucesso!"
    });
  };
  
  // Handle task status change
  const handleStatusChange = (id: string, newStatus: TaskStatus) => {
    setTasks(prevTasks => prevTasks.map(task => 
      task.id === id ? { ...task, status: newStatus } : task
    ));
    
    toast({
      title: "Status atualizado",
      description: "O status da tarefa foi atualizado com sucesso!"
    });
  };
  
  // Handle task edit
  const handleEditTask = (id: string, updatedTask: Partial<Task>) => {
    setTasks(prevTasks => prevTasks.map(task => 
      task.id === id ? { ...task, ...updatedTask } : task
    ));
    
    toast({
      title: "Tarefa atualizada",
      description: "A tarefa foi atualizada com sucesso!"
    });
  };
  
  // Handle task deletion
  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    
    toast({
      title: "Tarefa excluída",
      description: "A tarefa foi excluída com sucesso!"
    });
  };
  
  // Format date from YYYY-MM-DD to "DD de Month"
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    
    const day = date.getDate();
    const monthNames = [
      "janeiro", "fevereiro", "março", "abril", "maio", "junho",
      "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
    ];
    const month = monthNames[date.getMonth()];
    return `${day} de ${month}`;
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  // Get tasks for today's date
  const todaysTasks = tasks.filter(task => task.dueDate === formatSelectedDate(date));
  const pendingTasksCount = todaysTasks.filter(t => t.status === "pendente").length;
  const inProgressTasksCount = todaysTasks.filter(t => t.status === "em-andamento").length;
  const completedTasksCount = todaysTasks.filter(t => t.status === "concluída").length;

  return (
    <Layout 
      disciplines={disciplines} 
      onAddDiscipline={onAddDiscipline}
      onEditDiscipline={onEditDiscipline}
      onDeleteDiscipline={onDeleteDiscipline}
      onSearch={setSearchTerm}
      searchPlaceholder="Pesquisar tarefas no calendário..."
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-primary">
          Calendário
          <CalendarIcon className="inline-block ml-2 mb-1" size={24} />
        </h1>
        <CreateTaskDialog 
          disciplines={disciplines}
          onCreateTask={handleCreateTask}
        >
          <Button className="clay-button bg-primary text-white flex items-center gap-2">
            <PlusIcon size={16} />
            <span>Nova Tarefa</span>
          </Button>
        </CreateTaskDialog>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <motion.div 
            className="clay-card rounded-xl shadow-lg overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-4 bg-primary/10 border-b">
              <h3 className="text-lg font-semibold text-primary">Data Selecionada</h3>
              <p className="text-sm text-muted-foreground">
                {date?.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={setDate}
              className="bg-white rounded-xl p-3 pointer-events-auto"
              classNames={{
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                day_today: "border border-primary text-primary font-bold",
                day: "hover:bg-muted transition-colors"
              }}
            />
          </motion.div>
          
          <motion.div 
            className="clay-card mt-6 bg-gradient-to-r from-accent/20 to-primary/20 rounded-xl shadow-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="p-4 border-b bg-white/50">
              <h3 className="text-lg font-semibold text-primary">Resumo do Dia</h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center p-2 bg-white/80 rounded-lg">
                <span className="font-medium">Total de tarefas:</span>
                <span className="font-bold text-lg bg-primary/20 px-3 py-1 rounded-full">{todaysTasks.length}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white/80 rounded-lg">
                <span className="font-medium">Pendentes:</span>
                <span className="font-bold text-lg bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                  {pendingTasksCount}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white/80 rounded-lg">
                <span className="font-medium">Em andamento:</span>
                <span className="font-bold text-lg bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
                  {inProgressTasksCount}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white/80 rounded-lg">
                <span className="font-medium">Concluídas:</span>
                <span className="font-bold text-lg bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  {completedTasksCount}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="lg:col-span-8">
          <motion.div 
            className="clay-card h-full bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-4 border-b bg-primary/5">
              <h2 className="text-xl font-bold text-primary">
                Tarefas para {date?.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
              </h2>
            </div>
            
            <div className="p-4 space-y-4 max-h-[calc(100vh-20rem)] overflow-y-auto">
              {todaysTasks.length > 0 ? (
                todaysTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <TaskCard
                      task={task}
                      onStatusChange={handleStatusChange}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                      disciplines={disciplines}
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  className="text-center py-16 bg-white/50 rounded-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="text-muted-foreground text-lg mb-2">
                    {searchTerm ? "Nenhuma tarefa corresponde à sua pesquisa." : "Nenhuma tarefa para este dia."}
                  </p>
                  <p className="text-muted-foreground">
                    Use o botão "Nova Tarefa" para adicionar uma atividade.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Calendar;
