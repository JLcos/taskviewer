
import { useState, useEffect, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { TaskCard } from "@/components/TaskCard";
import { CreateTaskDialog } from "@/components/CreateTaskDialog";
import { useToast } from "@/hooks/use-toast";
import { Task, TaskStatus } from "@/types/TaskTypes";
import { motion } from "framer-motion";
import { CalendarIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import * as TaskService from "@/services/TaskService";

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
  const isMobile = useIsMobile();
  
  // Load tasks and register for real-time updates
  useEffect(() => {
    const loadTasks = async () => {
      const tasksData = await TaskService.getTasks();
      setTasks(tasksData);
    };
    
    // Initial load
    loadTasks();
    
    // Subscribe to real-time updates
    const unsubscribe = TaskService.subscribeToTasks(() => {
      loadTasks();
    });
    
    return () => {
      unsubscribe();
    };
  }, []);
  
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
  
  // Convert formatted date string "DD de month" back to Date object
  const parseFormattedDate = (dateString: string): Date | null => {
    const parts = dateString.split(' de ');
    if (parts.length !== 2) return null;
    
    const day = parseInt(parts[0], 10);
    const monthNames = [
      "janeiro", "fevereiro", "março", "abril", "maio", "junho",
      "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
    ];
    const monthIndex = monthNames.indexOf(parts[1]);
    
    if (isNaN(day) || monthIndex === -1) return null;
    
    const year = new Date().getFullYear();
    return new Date(year, monthIndex, day);
  };
  
  // Get all dates that have tasks
  const datesWithTasks = useMemo(() => {
    const dates: Date[] = [];
    tasks.forEach(task => {
      const date = parseFormattedDate(task.dueDate);
      if (date && !dates.some(d => d.getDate() === date.getDate() && d.getMonth() === date.getMonth())) {
        dates.push(date);
      }
    });
    return dates;
  }, [tasks]);
  
  // Filter tasks by search term
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = searchTerm === "" || 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.discipline.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });
  
  // Handle task creation
  const handleCreateTask = async (newTask: any) => {
    try {
      await TaskService.addTask({
        title: newTask.title,
        description: newTask.description,
        discipline: newTask.discipline,
        dueDate: formatDate(newTask.dueDate),
      });
      
      toast({
        title: "Tarefa criada",
        description: "A tarefa foi criada com sucesso!"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar a tarefa. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  // Handle task status change
  const handleStatusChange = async (id: string, newStatus: TaskStatus) => {
    try {
      await TaskService.changeTaskStatus(id, newStatus);
      
      toast({
        title: "Status atualizado",
        description: "O status da tarefa foi atualizado com sucesso!"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar o status. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  // Handle task edit
  const handleEditTask = async (id: string, updatedTask: Partial<Task>) => {
    try {
      await TaskService.updateTask(id, updatedTask);
      
      toast({
        title: "Tarefa atualizada",
        description: "A tarefa foi atualizada com sucesso!"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar a tarefa. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  // Handle task deletion
  const handleDeleteTask = async (id: string) => {
    try {
      await TaskService.deleteTask(id);
      
      toast({
        title: "Tarefa excluída",
        description: "A tarefa foi excluída com sucesso!"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir a tarefa. Tente novamente.",
        variant: "destructive"
      });
    }
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

  // Get tasks for selected date
  const selectedDateFormatted = formatSelectedDate(date);
  const todaysTasks = tasks.filter(task => task.dueDate === selectedDateFormatted);
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
      <div className="flex items-center justify-between mb-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4"
        >
          <div className="p-3 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl shadow-clay">
            <CalendarIcon className="text-primary" size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Calendário
            </h1>
            <p className="text-muted-foreground text-lg mt-1">
              Organize suas tarefas por data
            </p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <CreateTaskDialog 
            disciplines={disciplines}
            onCreateTask={handleCreateTask}
          >
            <Button className="clay-button bg-gradient-to-r from-primary to-accent text-primary-foreground flex items-center gap-3 px-6 py-3 text-lg font-semibold hover:shadow-clay-hover transition-all duration-200">
              <PlusIcon size={20} />
              <span className={isMobile ? "hidden" : "inline"}>Nova Tarefa</span>
            </Button>
          </CreateTaskDialog>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className={isMobile ? "col-span-1" : "lg:col-span-4"}>
          <motion.div 
            className="clay-card overflow-hidden backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-6 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 border-b border-border/50">
              <h3 className="text-xl font-bold text-primary mb-2">Data Selecionada</h3>
              <p className="text-muted-foreground font-medium">
                {date?.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div className="p-2">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                datesWithTasks={datesWithTasks}
                className="rounded-xl p-4 pointer-events-auto"
                classNames={{
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground shadow-clay-pressed",
                  day_today: "bg-accent text-accent-foreground font-bold shadow-clay-inner",
                  day: "hover:bg-secondary/50 transition-all duration-200 hover:shadow-clay-inner rounded-lg"
                }}
              />
            </div>
          </motion.div>
          
          <motion.div 
            className="clay-card mt-8 overflow-hidden bg-gradient-to-br from-card via-accent/5 to-primary/5"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="p-6 border-b border-border/30">
              <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                Resumo do Dia
                <div className="h-2 w-2 bg-primary rounded-full animate-pulse-gentle"></div>
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center p-4 bg-card/80 backdrop-blur-sm rounded-xl border border-border/20 shadow-clay-inner">
                <span className="font-semibold text-foreground">Total de tarefas</span>
                <span className="font-bold text-xl bg-primary/20 text-primary px-4 py-2 rounded-full shadow-clay-inner">{todaysTasks.length}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-card/80 backdrop-blur-sm rounded-xl border border-border/20 shadow-clay-inner">
                <span className="font-semibold text-foreground">Pendentes</span>
                <span className="font-bold text-xl bg-clay-yellow text-foreground px-4 py-2 rounded-full shadow-clay-inner">
                  {pendingTasksCount}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-card/80 backdrop-blur-sm rounded-xl border border-border/20 shadow-clay-inner">
                <span className="font-semibold text-foreground">Em andamento</span>
                <span className="font-bold text-xl bg-clay-orange text-foreground px-4 py-2 rounded-full shadow-clay-inner">
                  {inProgressTasksCount}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-card/80 backdrop-blur-sm rounded-xl border border-border/20 shadow-clay-inner">
                <span className="font-semibold text-foreground">Concluídas</span>
                <span className="font-bold text-xl bg-clay-mint text-foreground px-4 py-2 rounded-full shadow-clay-inner">
                  {completedTasksCount}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className={isMobile ? "col-span-1" : "lg:col-span-8"}>
          <motion.div 
            className="clay-card h-full bg-gradient-to-br from-card via-accent/5 to-primary/5 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-6 border-b border-border/30 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10">
              <h2 className="text-2xl font-bold text-primary flex items-center gap-3">
                <CalendarIcon className="text-primary" size={28} />
                Tarefas para {date?.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
              </h2>
              <p className="text-muted-foreground mt-2">
                Gerencie suas atividades do dia selecionado
              </p>
            </div>
            
            <div className="p-6 space-y-6 max-h-[calc(100vh-20rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
              {todaysTasks.length > 0 ? (
                todaysTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 300,
                      damping: 24
                    }}
                    className="transform hover:scale-[1.02] transition-transform duration-200"
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
                  className="text-center py-20 bg-gradient-to-br from-card/50 to-accent/10 rounded-2xl border border-border/20 backdrop-blur-sm"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
                    <CalendarIcon className="text-primary" size={32} />
                  </div>
                  <p className="text-foreground text-xl font-semibold mb-3">
                    {searchTerm ? "Nenhuma tarefa encontrada" : "Nenhuma tarefa para este dia"}
                  </p>
                  <p className="text-muted-foreground text-lg mb-6">
                    {searchTerm ? "Tente ajustar os filtros de pesquisa." : "Que tal adicionar uma nova atividade?"}
                  </p>
                  <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent rounded-full mx-auto"></div>
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
