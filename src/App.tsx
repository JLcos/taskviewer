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
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { getDisciplines, addDiscipline, updateDiscipline, deleteDiscipline, subscribeToDisciplines } from "./services/DisciplineService";
import { useToast } from "@/hooks/use-toast";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { Navigate } from "react-router-dom";

const queryClient = new QueryClient();

function AppContent() {
  const { user, loading } = useAuth();
  const [disciplines, setDisciplines] = useState<string[]>([]);
  const { toast } = useToast();

  // Load disciplines when user is authenticated
  useEffect(() => {
    if (!user) return;

    const loadDisciplines = async () => {
      try {
        const data = await getDisciplines(user.id);
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
  }, [user, toast]);

  const handleAddDiscipline = async (name: string) => {
    if (!user) return;
    try {
      await addDiscipline(name, user.id);
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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/" element={
        user ? (
          <Index 
            disciplines={disciplines} 
            onAddDiscipline={handleAddDiscipline} 
            onEditDiscipline={handleEditDiscipline} 
            onDeleteDiscipline={handleDeleteDiscipline} 
          />
        ) : (
          <Navigate to="/auth" replace />
        )
      } />
      <Route path="/calendar" element={
        user ? (
          <Calendar 
            disciplines={disciplines}
            onAddDiscipline={handleAddDiscipline}
            onEditDiscipline={handleEditDiscipline}
            onDeleteDiscipline={handleDeleteDiscipline}
          />
        ) : (
          <Navigate to="/auth" replace />
        )
      } />
      <Route path="/files" element={
        user ? (
          <Files 
            disciplines={disciplines}
            onAddDiscipline={handleAddDiscipline}
            onEditDiscipline={handleEditDiscipline}
            onDeleteDiscipline={handleDeleteDiscipline}
          />
        ) : (
          <Navigate to="/auth" replace />
        )
      } />
      <Route path="/analytics" element={
        user ? (
          <Analytics 
            disciplines={disciplines}
            onAddDiscipline={handleAddDiscipline}
            onEditDiscipline={handleEditDiscipline}
            onDeleteDiscipline={handleDeleteDiscipline}
          />
        ) : (
          <Navigate to="/auth" replace />
        )
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <BrowserRouter>
            <Toaster />
            <Sonner />
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;