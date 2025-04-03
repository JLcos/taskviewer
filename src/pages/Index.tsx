
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { StatusCard } from "@/components/StatusCard";
import { TaskCard } from "@/components/TaskCard";
import { CreateTaskDialog } from "@/components/CreateTaskDialog";
import { AddDisciplineDialog } from "@/components/AddDisciplineDialog";
import { ClockIcon, CircleCheckIcon, CircleIcon, PlusIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Task, TaskStatus } from "@/types/TaskTypes";

// Sample data
const initialDisciplines = ["Matemática", "Português", "Física", "Química", "História"];

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

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [disciplines, setDisciplines] = useState(initialDisciplines);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  
  // Filter tasks by search term
  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.discipline.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Calculate task statistics
  const totalTasks = tasks.length;
  const inProgressTasks = tasks.filter(task => task.status === "em-andamento").length;
  const completedTasks = tasks.filter(task => task.status === "concluída").length;
  const pendingTasks = tasks.filter(task => task.status === "pendente").length;
  
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
    
    setTasks([...tasks, taskToAdd]);
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
  
  // Handle discipline addition
  const handleAddDiscipline = (name: string) => {
    if (!disciplines.includes(name)) {
      setDisciplines([...disciplines, name]);
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

  return (
    <Layout 
      disciplines={disciplines} 
      onAddDiscipline={handleAddDiscipline}
      onSearch={setSearchTerm}
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Painel</h1>
        <CreateTaskDialog 
          disciplines={disciplines}
          onCreateTask={handleCreateTask}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatusCard
          title="Total de Tarefas"
          value={totalTasks}
          icon={<CircleIcon size={24} className="text-blue-600" />}
          color="bg-clay-blue"
          subtitle={`Em ${totalDisciplines} disciplinas`}
        />
        <StatusCard
          title="Em Andamento"
          value={inProgressTasks}
          icon={<ClockIcon size={24} className="text-orange-600" />}
          color="bg-clay-orange"
          subtitle={`${inProgressPercentage}% do total`}
        />
        <StatusCard
          title="Concluídas"
          value={completedTasks}
          icon={<CircleCheckIcon size={24} className="text-green-600" />}
          color="bg-clay-mint"
          subtitle={`${completedPercentage}% concluído`}
        />
      </div>
      
      <h2 className="text-2xl font-bold mb-4">Suas Tarefas</h2>
      <div className="space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
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
          <div className="clay-card flex flex-col items-center p-8">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-medium mb-2">Sem tarefas no momento</h3>
            <p className="text-muted-foreground text-center mb-6">
              {searchTerm ? "Nenhuma tarefa corresponde à sua pesquisa." : "Parece que você não tem nenhuma tarefa ainda. Que tal criar uma nova?"}
            </p>
            {!searchTerm && (
              <CreateTaskDialog 
                disciplines={disciplines}
                onCreateTask={handleCreateTask}
              />
            )}
          </div>
        )}
      </div>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Disciplinas</h2>
      <div className="clay-card">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {disciplines.map(discipline => (
            <div 
              key={discipline} 
              className="bg-clay-blue p-4 rounded-xl shadow-clay hover:shadow-clay-pressed cursor-pointer transition-all"
            >
              <h3 className="font-medium">{discipline}</h3>
            </div>
          ))}
          <div 
            className="border-2 border-dashed border-border p-4 rounded-xl flex items-center justify-center cursor-pointer hover:bg-secondary/50 transition-all"
            onClick={() => document.getElementById('add-discipline-trigger')?.click()}
          >
            <span className="text-muted-foreground font-medium">+ Adicionar</span>
          </div>
          <div className="hidden">
            <AddDisciplineDialog 
              onAddDiscipline={handleAddDiscipline}
              trigger={<button id="add-discipline-trigger">Add</button>}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
