
import { useState } from "react";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface DisciplineManagerProps {
  disciplines: string[];
  onAddDiscipline: (name: string) => void;
  onEditDiscipline: (oldName: string, newName: string) => void;
  onDeleteDiscipline: (name: string) => void;
}

export function DisciplineManager({ 
  disciplines, 
  onAddDiscipline, 
  onEditDiscipline, 
  onDeleteDiscipline 
}: DisciplineManagerProps) {
  const { toast } = useToast();
  const [editingDiscipline, setEditingDiscipline] = useState("");
  const [newDisciplineName, setNewDisciplineName] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [disciplineToDelete, setDisciplineToDelete] = useState("");

  const handleEdit = (disciplineName: string) => {
    setEditingDiscipline(disciplineName);
    setNewDisciplineName(disciplineName);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (disciplineName: string) => {
    setDisciplineToDelete(disciplineName);
    setIsDeleteDialogOpen(true);
  };

  const confirmEdit = () => {
    if (newDisciplineName.trim() === "") {
      toast({
        title: "Erro",
        description: "O nome da disciplina não pode estar vazio.",
        variant: "destructive",
      });
      return;
    }

    if (newDisciplineName !== editingDiscipline && disciplines.includes(newDisciplineName)) {
      toast({
        title: "Erro",
        description: "Esta disciplina já existe.",
        variant: "destructive",
      });
      return;
    }

    onEditDiscipline(editingDiscipline, newDisciplineName);
    setIsEditDialogOpen(false);
    toast({
      title: "Disciplina atualizada",
      description: `A disciplina foi atualizada com sucesso.`,
    });
  };

  const confirmDelete = () => {
    onDeleteDiscipline(disciplineToDelete);
    setIsDeleteDialogOpen(false);
    toast({
      title: "Disciplina excluída",
      description: `A disciplina "${disciplineToDelete}" foi excluída com sucesso.`,
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <>
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {disciplines.map((discipline) => (
          <motion.div 
            key={discipline}
            className="bg-clay-blue p-4 rounded-xl shadow-clay hover:shadow-clay-pressed transition-all relative group"
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <h3 className="font-medium">{discipline}</h3>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={() => handleEdit(discipline)}
              >
                <PencilIcon size={14} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-destructive" 
                onClick={() => handleDelete(discipline)}
              >
                <Trash2Icon size={14} />
              </Button>
            </div>
          </motion.div>
        ))}

        <motion.div 
          className="border-2 border-dashed border-border p-4 rounded-xl flex items-center justify-center cursor-pointer hover:bg-secondary/50 transition-all"
          onClick={() => document.getElementById('add-discipline-trigger')?.click()}
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-muted-foreground font-medium">+ Adicionar</span>
        </motion.div>
      </motion.div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Disciplina</DialogTitle>
            <DialogDescription>
              Modifique o nome da disciplina e clique em salvar quando terminar.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newDisciplineName}
              onChange={(e) => setNewDisciplineName(e.target.value)}
              placeholder="Nome da disciplina"
              className="clay-input"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
            <Button onClick={confirmEdit}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Excluir Disciplina</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a disciplina "{disciplineToDelete}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={confirmDelete}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
