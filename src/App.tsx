import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import Calendar from "./pages/Calendar";
import Files from "./pages/Files";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import { getDisciplines, addDiscipline, updateDiscipline, deleteDiscipline, subscribeToDisciplines } from "./services/DisciplineService";
import { useToast } from "@/hooks/use-toast";

const queryClient = new QueryClient();

function AppContent() {
  const [disciplines, setDisciplines] = useState<string[]>([]);
  const { toast } = useToast();
  const DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000000";

  // Load disciplines
  useEffect(() => {
    const loadDisciplines = async () => {
      try {
        const data = await getDisciplines(DEFAULT_USER_ID);
        setDisciplines(data);
      } catch (error) {
        console.error('Error loading disciplines:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as disciplinas",
          variant: "destructive",
        });
      }
    };

    loadDisciplines();

    // Subscribe to real-time changes
    const unsubscribe = subscribeToDisciplines(() => {
      loadDisciplines(); // Reload disciplines when changes occur
    });

    return unsubscribe;
  }, [toast]);

  const handleAddDiscipline = async (name: string) => {
    try {
      await addDiscipline(name, DEFAULT_USER_ID);
      toast({
        title: "Disciplina adicionada",
        description: `${name} foi adicionada com sucesso`,
      });
      // Real-time subscription will handle the update
    } catch (error) {
      console.error('Error adding discipline:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a disciplina",
        variant: "destructive",
      });
    }
  };

  const handleEditDiscipline = async (oldName: string, newName: string) => {
    try {
      await updateDiscipline(oldName, newName);
      toast({
        title: "Disciplina editada",
        description: `${oldName} foi renomeada para ${newName}`,
      });
      // Real-time subscription will handle the update
    } catch (error) {
      console.error('Error updating discipline:', error);
      toast({
        title: "Erro",
        description: "Não foi possível editar a disciplina",
        variant: "destructive",
      });
    }
  };

  const handleDeleteDiscipline = async (name: string) => {
    try {
      await deleteDiscipline(name);
      toast({
        title: "Disciplina removida",
        description: `${name} foi removida com sucesso`,
      });
      // Real-time subscription will handle the update
    } catch (error) {
      console.error('Error deleting discipline:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a disciplina",
        variant: "destructive",
      });
    }
  };

  return (
    <Routes>
      <Route path="/" element={
        <Index 
          disciplines={disciplines} 
          onAddDiscipline={handleAddDiscipline} 
          onEditDiscipline={handleEditDiscipline} 
          onDeleteDiscipline={handleDeleteDiscipline} 
        />
      } />
      <Route path="/calendar" element={
        <Calendar 
          disciplines={disciplines}
          onAddDiscipline={handleAddDiscipline}
          onEditDiscipline={handleEditDiscipline}
          onDeleteDiscipline={handleDeleteDiscipline}
        />
      } />
      <Route path="/files" element={
        <Files 
          disciplines={disciplines}
          onAddDiscipline={handleAddDiscipline}
          onEditDiscipline={handleEditDiscipline}
          onDeleteDiscipline={handleDeleteDiscipline}
        />
      } />
      <Route path="/analytics" element={
        <Analytics 
          disciplines={disciplines}
          onAddDiscipline={handleAddDiscipline}
          onEditDiscipline={handleEditDiscipline}
          onDeleteDiscipline={handleDeleteDiscipline}
        />
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Toaster />
          <Sonner />
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;