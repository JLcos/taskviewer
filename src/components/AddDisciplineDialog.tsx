
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PlusIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddDisciplineDialogProps {
  onAddDiscipline: (name: string) => void;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddDisciplineDialog({ onAddDiscipline, trigger, open, onOpenChange }: AddDisciplineDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [disciplineName, setDisciplineName] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!disciplineName.trim()) {
      toast({
        title: "Erro",
        description: "Digite um nome para a disciplina",
        variant: "destructive"
      });
      return;
    }
    
    onAddDiscipline(disciplineName);
    setDisciplineName("");
    
    // If controlled externally, use onOpenChange
    if (onOpenChange) {
      onOpenChange(false);
    } else {
      setIsOpen(false);
    }
    
    toast({
      title: "Disciplina adicionada",
      description: "A disciplina foi adicionada com sucesso!"
    });
  };

  // Use either controlled or uncontrolled state
  const dialogOpen = open !== undefined ? open : isOpen;
  const setDialogOpen = onOpenChange || setIsOpen;

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="clay-button bg-primary text-primary-foreground">
            <PlusIcon className="mr-2" size={18} />
            Adicionar Disciplina
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-white rounded-2xl shadow-clay border-none">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Disciplina</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <label htmlFor="discipline-name" className="text-sm font-medium">
              Nome da Disciplina
            </label>
            <Input
              id="discipline-name"
              placeholder="Digite o nome da disciplina"
              className="clay-input"
              value={disciplineName}
              onChange={(e) => setDisciplineName(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button 
              type="button"
              variant="outline" 
              className="clay-button bg-secondary"
              onClick={() => setDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="clay-button bg-primary text-primary-foreground"
            >
              Adicionar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
