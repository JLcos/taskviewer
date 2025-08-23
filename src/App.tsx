
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Calendar from "./pages/Calendar";
import Files from "./pages/Files";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import { useState, useEffect } from "react";
import * as DisciplineService from "@/services/DisciplineService";

const queryClient = new QueryClient();

const App = () => {
  // Global state for disciplines that can be shared across pages
  const [globalDisciplines, setGlobalDisciplines] = useState<string[]>([]);
  
  // Load disciplines from Supabase on app start
  useEffect(() => {
    const loadDisciplines = async () => {
      try {
        const disciplines = await DisciplineService.getDisciplines();
        if (disciplines.length === 0) {
          // Initialize with default disciplines if none exist
          const defaultDisciplines = ["Matemática", "Português", "Física", "Química", "História"];
          for (const discipline of defaultDisciplines) {
            await DisciplineService.addDiscipline(discipline);
          }
          setGlobalDisciplines(defaultDisciplines);
        } else {
          setGlobalDisciplines(disciplines);
        }
      } catch (error) {
        console.error('Error loading disciplines:', error);
        // Fallback to default disciplines if error
        setGlobalDisciplines(["Matemática", "Português", "Física", "Química", "História"]);
      }
    };

    loadDisciplines();

    // Subscribe to real-time updates
    const unsubscribe = DisciplineService.subscribeToDisciplines(() => {
      loadDisciplines();
    });

    return () => {
      unsubscribe();
    };
  }, []);
  
  const handleAddDiscipline = async (name: string) => {
    if (!globalDisciplines.includes(name)) {
      try {
        await DisciplineService.addDiscipline(name);
        // The real-time subscription will update the state automatically
      } catch (error) {
        console.error('Error adding discipline:', error);
      }
    }
  };

  const handleEditDiscipline = async (oldName: string, newName: string) => {
    try {
      await DisciplineService.updateDiscipline(oldName, newName);
      // The real-time subscription will update the state automatically
    } catch (error) {
      console.error('Error editing discipline:', error);
    }
  };

  const handleDeleteDiscipline = async (name: string) => {
    try {
      await DisciplineService.deleteDiscipline(name);
      // The real-time subscription will update the state automatically
    } catch (error) {
      console.error('Error deleting discipline:', error);
    }
  };

  const disciplineProps = {
    disciplines: globalDisciplines,
    onAddDiscipline: handleAddDiscipline,
    onEditDiscipline: handleEditDiscipline,
    onDeleteDiscipline: handleDeleteDiscipline
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index {...disciplineProps} />} />
            <Route path="/calendario" element={<Calendar {...disciplineProps} />} />
            <Route path="/arquivos" element={<Files {...disciplineProps} />} />
            <Route path="/analiticos" element={<Analytics {...disciplineProps} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
