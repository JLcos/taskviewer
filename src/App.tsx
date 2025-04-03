
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
import { useState } from "react";

const queryClient = new QueryClient();

const App = () => {
  // Global state for disciplines that can be shared across pages
  const [globalDisciplines, setGlobalDisciplines] = useState([
    "Matemática", "Português", "Física", "Química", "História"
  ]);
  
  const handleAddDiscipline = (name: string) => {
    if (!globalDisciplines.includes(name)) {
      setGlobalDisciplines([...globalDisciplines, name]);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index disciplines={globalDisciplines} onAddDiscipline={handleAddDiscipline} />} />
            <Route path="/calendario" element={<Calendar disciplines={globalDisciplines} onAddDiscipline={handleAddDiscipline} />} />
            <Route path="/arquivos" element={<Files disciplines={globalDisciplines} onAddDiscipline={handleAddDiscipline} />} />
            <Route path="/analiticos" element={<Analytics disciplines={globalDisciplines} onAddDiscipline={handleAddDiscipline} />} />
            <Route path="*" element={<NotFound disciplines={globalDisciplines} onAddDiscipline={handleAddDiscipline} />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
