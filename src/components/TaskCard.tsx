import { useState } from "react";
import { CheckIcon, ClockIcon, MoreVerticalIcon } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Task, TaskStatus } from "@/types/TaskTypes";

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onStatusChange, onEdit, onDelete }: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const statusColors = {
    "pendente": "bg-clay-yellow text-yellow-700",
    "em-andamento": "bg-clay-orange text-orange-700",
    "concluída": "bg-clay-mint text-green-700"
  };
  
  const statusLabels = {
    "pendente": "Pendente",
    "em-andamento": "Em Andamento",
    "concluída": "Concluída"
  };

  return (
    <div 
      className="clay-card hover:shadow-lg transition-all"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <div className="mr-3">
            <ClockIcon size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{task.title}</h3>
            <span className="inline-block px-3 py-1 rounded-full bg-clay-blue text-blue-700 text-sm font-medium mt-1">
              {task.discipline}
            </span>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger className="p-2 rounded-full hover:bg-muted">
            <MoreVerticalIcon size={18} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white rounded-xl shadow-clay p-2 min-w-[220px]">
            <DropdownMenuItem 
              className="rounded-lg hover:bg-clay-yellow cursor-pointer"
              onClick={() => onStatusChange(task.id, "pendente")}
            >
              Marcar como Pendente
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="rounded-lg hover:bg-clay-orange cursor-pointer"
              onClick={() => onStatusChange(task.id, "em-andamento")}
            >
              Marcar Em Andamento
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="rounded-lg hover:bg-clay-mint cursor-pointer"
              onClick={() => onStatusChange(task.id, "concluída")}
            >
              Marcar como Concluída
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="rounded-lg hover:bg-clay-blue cursor-pointer"
              onClick={() => onEdit(task.id)}
            >
              Editar Tarefa
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="rounded-lg hover:bg-clay-red cursor-pointer text-red-600"
              onClick={() => onDelete(task.id)}
            >
              Excluir Tarefa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {task.description && (
        <p className="text-muted-foreground mt-2">{task.description}</p>
      )}
      
      <div className="flex items-center justify-between mt-4">
        <span className={`clay-status-badge ${statusColors[task.status]}`}>
          {statusLabels[task.status]}
        </span>
        <span className="text-sm text-muted-foreground">
          {task.dueDate}
        </span>
      </div>
    </div>
  );
}
