
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { StatusCard } from "@/components/StatusCard";
import { TaskCard } from "@/components/TaskCard";
import { CreateTaskDialog } from "@/components/CreateTaskDialog";
import { ClockIcon, CircleCheckIcon, CircleIcon, PlusIcon, BookOpenIcon, CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Task, TaskStatus } from "@/types/TaskTypes";
import { motion } from "framer-motion";
import { DisciplineManager } from "@/components/DisciplineManager";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import * as TaskService from "@/services/TaskService";

interface IndexProps {
  disciplines: string[];
  onAddDiscipline: (name: string) => void;
  onEditDiscipline: (oldName: string, newName: string) => void;
  onDeleteDiscipline: (name: string) => void;
}

const Index = ({
  disciplines,
  onAddDiscipline,
  onEditDiscipline,
  onDeleteDiscipline
}: IndexProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Load tasks and register for real-time updates
  useEffect(() => {
    const loadTasks = () => {
      setTasks(TaskService.getTasks());
    };
    
    // Initial load
    loadTasks();
    
    // Register for updates
    const cleanup = TaskService.registerForUpdates(loadTasks);
    
    // Listen for local storage changes in the same tab
    window.addEventListener('local-storage-updated', loadTasks);
    
    return () => {
      cleanup();
      window.removeEventListener('local-storage-updated', loadTasks);
    };
  }, []);

  // Filter tasks by search term
  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    task.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
    task.discipline.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get tasks by status
  const pendingTasks = tasks.filter(task => task.status === "pendente");
  const inProgressTasks = tasks.filter(task => task.status === "em-andamento");
  const completedTasks = tasks.filter(task => task.status === "concluída");

  // Calculate task statistics
  const totalTasks = tasks.length;
  const inProgressTasksCount = inProgressTasks.length;
  const completedTasksCount = completedTasks.length;
  const pendingTasksCount = pendingTasks.length;
  const totalDisciplines = [...new Set(tasks.map(task => task.discipline))].length;
  const completedPercentage = totalTasks > 0 ? Math.round(completedTasksCount / totalTasks * 100) : 0;
  const inProgressPercentage = totalTasks > 0 ? Math.round(inProgressTasksCount / totalTasks * 100) : 0;

  // Handle task creation
  const handleCreateTask = (newTask: Omit<Task, 'id' | 'status'>) => {
    TaskService.addTask(newTask);
    
    toast({
      title: "Tarefa criada",
      description: "A tarefa foi criada com sucesso!"
    });
  };

  // Handle task status change
  const handleStatusChange = (id: string, newStatus: TaskStatus) => {
    TaskService.changeTaskStatus(id, newStatus);
    
    toast({
      title: "Status atualizado",
      description: "O status da tarefa foi atualizado com sucesso!"
    });
  };

  // Handle task edit
  const handleEditTask = (id: string, updatedTask: Partial<Task>) => {
    TaskService.updateTask(id, updatedTask);
    
    toast({
      title: "Tarefa atualizada",
      description: "A tarefa foi atualizada com sucesso!"
    });
  };

  // Handle task deletion
  const handleDeleteTask = (id: string) => {
    TaskService.deleteTask(id);
    
    toast({
      title: "Tarefa excluída",
      description: "A tarefa foi excluída com sucesso!"
    });
  };
  
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: {
      y: 20,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1
    }
  };
  
  return (
    <Layout 
      disciplines={disciplines} 
      onAddDiscipline={onAddDiscipline} 
      onEditDiscipline={onEditDiscipline} 
      onDeleteDiscipline={onDeleteDiscipline} 
      onSearch={setSearchTerm}
    >
      <motion.div 
        className="flex items-center justify-between mb-6" 
        initial={{
          opacity: 0,
          y: -10
        }} 
        animate={{
          opacity: 1,
          y: 0
        }} 
        transition={{
          duration: 0.3
        }}
      >
        <h1 className="text-2xl md:text-3xl font-bold">Painel</h1>
        <CreateTaskDialog disciplines={disciplines} onCreateTask={handleCreateTask}>
          <Button className="clay-button bg-primary text-white flex items-center gap-2">
            <PlusIcon size={16} />
            <span className={isMobile ? "hidden" : "inline"}>Nova Tarefa</span>
          </Button>
        </CreateTaskDialog>
      </motion.div>
      
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6" 
        variants={containerVariants} 
        initial="hidden" 
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <StatusCard 
            title="Tarefas Pendentes" 
            value={pendingTasksCount} 
            icon={<CircleIcon size={24} className="text-yellow-600" />} 
            color="bg-clay-yellow" 
            subtitle={`${Math.round(pendingTasksCount / Math.max(totalTasks, 1) * 100)}% do total`} 
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <StatusCard 
            title="Em Andamento" 
            value={inProgressTasksCount} 
            icon={<ClockIcon size={24} className="text-orange-600" />} 
            color="bg-clay-orange" 
            subtitle={`${inProgressPercentage}% do total`} 
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <StatusCard 
            title="Concluídas" 
            value={completedTasksCount} 
            icon={<CircleCheckIcon size={24} className="text-green-600" />} 
            color="bg-clay-mint" 
            subtitle={`${completedPercentage}% concluído`} 
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <StatusCard 
            title="Disciplinas" 
            value={totalDisciplines} 
            icon={<BookOpenIcon size={24} className="text-blue-600" />} 
            color="bg-clay-blue" 
            subtitle="Total de disciplinas" 
          />
        </motion.div>
      </motion.div>
      
      {/* Quick Links */}
      <motion.div 
        className="clay-card mb-6 bg-gradient-to-r from-primary/5 to-accent/5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex flex-wrap gap-4">
          <Link to="/calendario" className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
            <CalendarIcon size={20} className="text-primary" />
            <span>Calendário</span>
          </Link>
          <Link to="/arquivos" className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
            <BookOpenIcon size={20} className="text-primary" />
            <span>Arquivos</span>
          </Link>
        </div>
      </motion.div>
      
      {/* Task sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Pending Tasks */}
        <motion.div 
          className="clay-card" 
          initial={{
            opacity: 0,
            y: 20
          }} 
          animate={{
            opacity: 1,
            y: 0
          }} 
          transition={{
            delay: 0.2
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Tarefas Pendentes ({pendingTasksCount})</h2>
          </div>
          
          <div className="space-y-4 max-h-60 md:max-h-80 overflow-y-auto pr-2">
            {pendingTasks.length > 0 ? (
              pendingTasks.map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onStatusChange={handleStatusChange} 
                  onEdit={handleEditTask} 
                  onDelete={handleDeleteTask} 
                  disciplines={disciplines} 
                />
              ))
            ) : (
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-muted-foreground">Não há tarefas pendentes</p>
              </div>
            )}
          </div>
        </motion.div>
        
        {/* In Progress Tasks */}
        <motion.div 
          className="clay-card" 
          initial={{
            opacity: 0,
            y: 20
          }} 
          animate={{
            opacity: 1,
            y: 0
          }} 
          transition={{
            delay: 0.3
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Em Andamento ({inProgressTasksCount})</h2>
          </div>
          
          <div className="space-y-4 max-h-60 md:max-h-80 overflow-y-auto pr-2">
            {inProgressTasks.length > 0 ? (
              inProgressTasks.map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onStatusChange={handleStatusChange} 
                  onEdit={handleEditTask} 
                  onDelete={handleDeleteTask} 
                  disciplines={disciplines} 
                />
              ))
            ) : (
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-muted-foreground">Não há tarefas em andamento</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
      
      <motion.h2 
        className="text-xl md:text-2xl font-bold mb-4" 
        initial={{
          opacity: 0,
          x: -20
        }} 
        animate={{
          opacity: 1,
          x: 0
        }} 
        transition={{
          delay: 0.3
        }}
      >
        Todas as Tarefas
      </motion.h2>
      
      <motion.div 
        className="clay-card mb-8" 
        variants={containerVariants} 
        initial="hidden" 
        animate="visible"
      >
        <div className="space-y-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task, index) => (
              <motion.div 
                key={task.id} 
                variants={itemVariants} 
                initial="hidden" 
                animate="visible" 
                transition={{
                  delay: 0.1 * index
                }} 
                whileHover={{
                  scale: 1.01
                }}
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
              className="flex flex-col items-center p-8" 
              variants={itemVariants}
            >
              <motion.div 
                className="text-6xl mb-4" 
                initial={{
                  scale: 0.8
                }} 
                animate={{
                  scale: 1
                }} 
                transition={{
                  duration: 0.5,
                  delay: 0.2,
                  type: "spring"
                }}
              >
                📝
              </motion.div>
              <h3 className="text-xl font-medium mb-2">Sem tarefas no momento</h3>
              <p className="text-muted-foreground text-center mb-6">
                {searchTerm ? "Nenhuma tarefa corresponde à sua pesquisa." : "Parece que você não tem nenhuma tarefa ainda. Que tal criar uma nova?"}
              </p>
              {!searchTerm && (
                <motion.div 
                  whileHover={{
                    scale: 1.05
                  }} 
                  whileTap={{
                    scale: 0.95
                  }}
                >
                  <CreateTaskDialog disciplines={disciplines} onCreateTask={handleCreateTask}>
                    <Button className="clay-button bg-primary text-white flex items-center gap-2">
                      <PlusIcon size={16} />
                      <span>Nova Tarefa</span>
                    </Button>
                  </CreateTaskDialog>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
      
      <motion.h2 
        className="text-xl md:text-2xl font-bold mt-8 mb-4" 
        initial={{
          opacity: 0,
          x: -20
        }} 
        animate={{
          opacity: 1,
          x: 0
        }} 
        transition={{
          delay: 0.4
        }}
      >
        Disciplinas
      </motion.h2>
      
      <motion.div 
        className="clay-card" 
        initial={{
          opacity: 0,
          y: 20
        }} 
        animate={{
          opacity: 1,
          y: 0
        }} 
        transition={{
          delay: 0.5
        }}
      >
        <DisciplineManager 
          disciplines={disciplines} 
          onAddDiscipline={onAddDiscipline} 
          onEditDiscipline={onEditDiscipline} 
          onDeleteDiscipline={onDeleteDiscipline} 
        />
      </motion.div>
    </Layout>
  );
};

export default Index;
