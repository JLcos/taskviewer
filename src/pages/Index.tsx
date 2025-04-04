
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { StatusCard } from "@/components/StatusCard";
import { TaskCard } from "@/components/TaskCard";
import { CreateTaskDialog } from "@/components/CreateTaskDialog";
import { ClockIcon, CircleCheckIcon, CircleIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Task, TaskStatus } from "@/types/TaskTypes";
import { motion } from "framer-motion";
import { DisciplineManager } from "@/components/DisciplineManager";

// Sample data
const initialTasks: Task[] = [
  {
    id: "1",
    title: "Revisão",
    description: "Fazer a Revisão de sociologia",
    discipline: "Matemática",
    status: "pendente",
    dueDate: "10 de abril"
  }
];

// Storage keys
const TASKS_STORAGE_KEY = 'task-viewer-tasks';

interface IndexProps {
  disciplines: string[];
  onAddDiscipline: (name: string) => void;
  onEditDiscipline: (oldName: string, newName: string) => void;
  onDeleteDiscipline: (name: string) => void;
}

const Index = ({ disciplines, onAddDiscipline, onEditDiscipline, onDeleteDiscipline }: IndexProps) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  
  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);
  
  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);
  
  // Filter tasks by search term
  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.discipline.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Get pending tasks for the rectangle display
  const pendingTasks = tasks.filter(task => task.status === "pendente");
  
  // Calculate task statistics
  const totalTasks = tasks.length;
  const inProgressTasks = tasks.filter(task => task.status === "em-andamento").length;
  const completedTasks = tasks.filter(task => task.status === "concluída").length;
  const pendingTasksCount = tasks.filter(task => task.status === "pendente").length;
  
  const totalDisciplines = [...new Set(tasks.map(task => task.discipline))].length;
  const completedPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const inProgressPercentage = totalTasks > 0 ? Math.round((inProgressTasks / totalTasks) * 100) : 0;

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
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    
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
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
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
        className="flex items-center justify-between mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold">Painel</h1>
        <CreateTaskDialog 
          disciplines={disciplines}
          onCreateTask={handleCreateTask}
        />
      </motion.div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <StatusCard
            title="Total de Tarefas"
            value={totalTasks}
            icon={<CircleIcon size={24} className="text-blue-600" />}
            color="bg-clay-blue"
            subtitle={`Em ${totalDisciplines} disciplinas`}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatusCard
            title="Em Andamento"
            value={inProgressTasks}
            icon={<ClockIcon size={24} className="text-orange-600" />}
            color="bg-clay-orange"
            subtitle={`${inProgressPercentage}% do total`}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatusCard
            title="Concluídas"
            value={completedTasks}
            icon={<CircleCheckIcon size={24} className="text-green-600" />}
            color="bg-clay-mint"
            subtitle={`${completedPercentage}% concluído`}
          />
        </motion.div>
      </motion.div>
      
      {/* Pending Tasks Rectangle */}
      <motion.div 
        className="clay-card mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Tarefas Pendentes ({pendingTasksCount})</h2>
        </div>
        
        <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
          {pendingTasks.length > 0 ? (
            pendingTasks.map((task) => (
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
      
      <motion.h2 
        className="text-2xl font-bold mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        Suas Tarefas
      </motion.h2>
      <motion.div 
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task, index) => (
            <motion.div 
              key={task.id}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.01 }}
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
            className="clay-card flex flex-col items-center p-8"
            variants={itemVariants}
          >
            <motion.div 
              className="text-6xl mb-4"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
            >
              📝
            </motion.div>
            <h3 className="text-xl font-medium mb-2">Sem tarefas no momento</h3>
            <p className="text-muted-foreground text-center mb-6">
              {searchTerm ? "Nenhuma tarefa corresponde à sua pesquisa." : "Parece que você não tem nenhuma tarefa ainda. Que tal criar uma nova?"}
            </p>
            {!searchTerm && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <CreateTaskDialog 
                  disciplines={disciplines}
                  onCreateTask={handleCreateTask}
                />
              </motion.div>
            )}
          </motion.div>
        )}
      </motion.div>
      
      <motion.h2 
        className="text-2xl font-bold mt-8 mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        Disciplinas
      </motion.h2>
      <motion.div 
        className="clay-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <DisciplineManager
          disciplines={disciplines}
          onAddDiscipline={onAddDiscipline}
          onEditDiscipline={onEditDiscipline}
          onDeleteDiscipline={onDeleteDiscipline}
        />
        <div className="hidden">
          <div id="add-discipline-trigger"></div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Index;
