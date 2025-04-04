
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { TaskCard } from "@/components/TaskCard";
import { CreateTaskDialog } from "@/components/CreateTaskDialog";
import { useToast } from "@/hooks/use-toast";
import { Task, TaskStatus } from "@/types/TaskTypes";
import { motion } from "framer-motion";

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
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Revisão",
      description: "Fazer a Revisão de sociologia",
      discipline: "Matemática",
      status: "pendente",
      dueDate: "10 de abril"
    }
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  
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
    
    setTasks([...tasks, taskToAdd]);
    
    toast({
      title: "Tarefa criada",
      description: "A tarefa foi criada com sucesso!"
    });
  };
  
  // Handle task status change
  const handleStatusChange = (id: string, newStatus: TaskStatus) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status: newStatus } : task
    ));
    
    toast({
      title: "Status atualizado",
      description: "O status da tarefa foi atualizado com sucesso!"
    });
  };
  
  // Handle task edit
  const handleEditTask = (id: string, updatedTask: Partial<Task>) => {
    setTasks(tasks.map(task => 
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
    // Add one day to fix the date issue
    date.setDate(date.getDate() + 1);
    
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
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
          Calendário
        </h1>
        <CreateTaskDialog 
          disciplines={disciplines}
          onCreateTask={handleCreateTask}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <motion.div 
            className="clay-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={setDate}
              className="bg-white rounded-xl p-3 pointer-events-auto"
              classNames={{
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground font-bold",
                day: "hover:bg-muted transition-colors"
              }}
            />
          </motion.div>
          
          <motion.div 
            className="clay-card mt-4 bg-gradient-to-r from-accent/30 to-primary/30"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h3 className="text-lg font-semibold mb-2">Resumo do Dia</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total de tarefas:</span>
                <span className="font-bold">{filteredTasks.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Pendentes:</span>
                <span className="font-bold text-yellow-600">
                  {filteredTasks.filter(t => t.status === "pendente").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Em andamento:</span>
                <span className="font-bold text-orange-600">
                  {filteredTasks.filter(t => t.status === "em-andamento").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Concluídas:</span>
                <span className="font-bold text-green-600">
                  {filteredTasks.filter(t => t.status === "concluída").length}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="lg:col-span-2">
          <motion.div 
            className="clay-card h-full bg-gradient-to-br from-white to-gray-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
              Tarefas para {date?.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
            </h2>
            
            <div className="space-y-4 mt-6">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
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
                  className="text-center py-16"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="text-muted-foreground text-lg">
                    {searchTerm ? "Nenhuma tarefa corresponde à sua pesquisa." : "Nenhuma tarefa para este dia."}
                  </p>
                  <p className="text-muted-foreground mt-2">
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
