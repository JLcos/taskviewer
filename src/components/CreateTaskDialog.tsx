import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Task } from "@/types/TaskTypes";
interface CreateTaskDialogProps {
  disciplines: string[];
  onCreateTask: (task: Omit<Task, 'id' | 'status'>) => void;
}
export function CreateTaskDialog({
  disciplines,
  onCreateTask
}: CreateTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [dueDate, setDueDate] = useState("");
  const {
    toast
  } = useToast();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !discipline || !dueDate) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    onCreateTask({
      title,
      description,
      discipline,
      dueDate
    });

    // Clear the form
    setTitle("");
    setDescription("");
    setDiscipline("");
    setDueDate("");
    setOpen(false);
  };
  return <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        
      </DialogTrigger>
      <DialogContent className="bg-white rounded-2xl shadow-clay p-6 border-none max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Nova Tarefa</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para criar uma nova tarefa
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Título *
            </label>
            <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Digite o título da tarefa" className="clay-input" required />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Descrição
            </label>
            <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Descreva sua tarefa (opcional)" className="clay-input min-h-[100px]" />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="discipline" className="text-sm font-medium">
              Disciplina *
            </label>
            <Select value={discipline} onValueChange={setDiscipline} required>
              <SelectTrigger className="clay-input">
                <SelectValue placeholder="Selecione uma disciplina" />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-xl shadow-clay">
                {disciplines.map(disc => <SelectItem key={disc} value={disc}>
                    {disc}
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="dueDate" className="text-sm font-medium">
              Data de Entrega *
            </label>
            <Input id="dueDate" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="clay-input" required />
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="clay-button bg-secondary">
              Cancelar
            </Button>
            <Button type="submit" className="clay-button bg-primary text-primary-foreground hover:bg-primary/90">
              Criar Tarefa
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>;
}