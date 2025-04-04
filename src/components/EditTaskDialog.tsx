
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Task } from "@/types/TaskTypes";
import { useToast } from "@/hooks/use-toast";

interface EditTaskDialogProps {
  task: Task;
  disciplines: string[];
  onUpdateTask: (id: string, updatedTask: Partial<Task>) => void;
}

export function EditTaskDialog({ task, disciplines, onUpdateTask }: EditTaskDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [discipline, setDiscipline] = useState(task.discipline);
  const [dueDate, setDueDate] = useState(formatDateForInput(task.dueDate));
  const [status, setStatus] = useState(task.status);
  const { toast } = useToast();

  // Update local state when task changes
  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description);
    setDiscipline(task.discipline);
    setDueDate(formatDateForInput(task.dueDate));
    setStatus(task.status);
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onUpdateTask(task.id, {
      title,
      description,
      discipline,
      status,
      dueDate: formatDateForDisplay(dueDate),
    });
    
    toast({
      title: "Tarefa atualizada",
      description: "A tarefa foi atualizada com sucesso!"
    });
    
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white rounded-2xl shadow-clay border-none">
        <DialogHeader>
          <DialogTitle>Editar Tarefa</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para editar a tarefa
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Título
            </label>
            <Input
              id="title"
              placeholder="Digite o título da tarefa"
              className="clay-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Descrição
            </label>
            <Input
              id="description"
              placeholder="Digite a descrição da tarefa"
              className="clay-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="discipline" className="text-sm font-medium">
              Disciplina
            </label>
            <select
              id="discipline"
              className="clay-input w-full"
              value={discipline}
              onChange={(e) => setDiscipline(e.target.value)}
              required
            >
              {disciplines.map(disc => (
                <option key={disc} value={disc}>{disc}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium">
              Status
            </label>
            <select
              id="status"
              className="clay-input w-full"
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              required
            >
              <option value="pendente">Pendente</option>
              <option value="em-andamento">Em Andamento</option>
              <option value="concluída">Concluída</option>
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="dueDate" className="text-sm font-medium">
              Data de Entrega
            </label>
            <Input
              id="dueDate"
              type="date"
              className="clay-input"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button 
              type="button"
              variant="outline" 
              className="clay-button bg-secondary"
              onClick={() => setIsOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="clay-button bg-primary text-primary-foreground"
            >
              Salvar Alterações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Format date from "DD de month" to YYYY-MM-DD for input
function formatDateForInput(dateString: string): string {
  const months = [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
  ];
  
  const parts = dateString.split(" de ");
  if (parts.length !== 2) return "";
  
  const day = parseInt(parts[0]);
  const month = months.findIndex(m => m === parts[1]);
  
  if (isNaN(day) || month === -1) return "";
  
  const year = new Date().getFullYear();
  return `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

// Format date from YYYY-MM-DD to "DD de Month" for display
function formatDateForDisplay(dateString: string): string {
  const date = new Date(dateString);
  
  // Removed the date adjustment that was causing the issue
  const day = date.getDate();
  const monthNames = [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
  ];
  const month = monthNames[date.getMonth()];
  return `${day} de ${month}`;
}
