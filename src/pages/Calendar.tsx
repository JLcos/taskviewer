
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { TaskCard } from "@/components/TaskCard";
import { CreateTaskDialog } from "@/components/CreateTaskDialog";
import { useToast } from "@/hooks/use-toast";

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [tasks, setTasks] = useState([
    {
      id: "1",
      title: "Revisão",
      description: "Fazer a Revisão de sociologia",
      discipline: "Matemática",
      status: "pendente" as const,
      dueDate: "10 de abril"
    }
  ]);
  const [disciplines, setDisciplines] = useState([
    "Matemática", "Português", "Física", "Química", "História"
  ]);
  const { toast } = useToast();
  
  // Handle task creation
  const handleCreateTask = (newTask: any) => {
    const taskToAdd = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      discipline: newTask.discipline,
      status: "pendente" as const,
      dueDate: formatDate(newTask.dueDate),
    };
    
    setTasks([...tasks, taskToAdd]);
  };
  
  // Handle task status change
  const handleStatusChange = (id: string, newStatus: "pendente" | "em-andamento" | "concluída") => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status: newStatus } : task
    ));
    
    toast({
      title: "Status atualizado",
      description: "O status da tarefa foi atualizado com sucesso!"
    });
  };
  
  // Handle task edit
  const handleEditTask = (id: string) => {
    toast({
      title: "Editar tarefa",
      description: "Funcionalidade de edição será implementada em breve!"
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

  return (
    <Layout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Calendário</h1>
        <CreateTaskDialog 
          disciplines={disciplines}
          onCreateTask={handleCreateTask}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="clay-card">
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={setDate}
              className="bg-white rounded-xl p-3 pointer-events-auto"
              classNames={{
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
                day: "hover:bg-muted transition-colors"
              }}
            />
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="clay-card h-full">
            <h2 className="text-2xl font-bold mb-4">Tarefas para {date?.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}</h2>
            
            <div className="space-y-4 mt-6">
              {tasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStatusChange={handleStatusChange}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Calendar;
