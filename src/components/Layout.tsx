import { ReactNode, useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { motion, AnimatePresence } from "framer-motion";
import { MenuIcon, XIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { DockNavigation } from "@/components/DockNavigation";
import { AddDisciplineDialog } from "@/components/AddDisciplineDialog";

interface LayoutProps {
  children: ReactNode;
  disciplines: string[];
  onAddDiscipline: (name: string) => void;
  onEditDiscipline?: (oldName: string, newName: string) => void;
  onDeleteDiscipline?: (name: string) => void;
  onSearch?: (term: string) => void;
  searchPlaceholder?: string;
}

export function Layout({ 
  children, 
  disciplines, 
  onAddDiscipline, 
  onEditDiscipline,
  onDeleteDiscipline,
  onSearch,
  searchPlaceholder = "Pesquisar tarefas, arquivos ou anotações..." 
}: LayoutProps) {
  const [showDisciplineDialog, setShowDisciplineDialog] = useState(false);
  const isMobile = useIsMobile();
  
  const handleSearch = (term: string) => {
    if (onSearch) {
      onSearch(term);
    }
  };

  const pageTransitions = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } }
  };

  const handleAddDisciplineClick = () => {
    setShowDisciplineDialog(true);
  };

  const handleAddDisciplineSubmit = (name: string) => {
    onAddDiscipline(name);
    setShowDisciplineDialog(false);
  };

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <motion.header 
        className="h-16 border-b flex items-center justify-center px-3 md:px-6 shadow-sm bg-white/80 backdrop-blur-sm"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="flex-1 max-w-xl">
          {onSearch ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="w-full"
            >
              <SearchBar
                onSearch={handleSearch}
                placeholder={searchPlaceholder}
                className="clay-input w-full md:w-auto"
              />
            </motion.div>
          ) : (
            <div className="h-10"></div> 
          )}
        </div>
      </motion.header>
      
      <AnimatePresence mode="wait">
        <motion.main 
          key="main-content"
          className="flex-1 overflow-y-auto p-3 pb-24 md:p-6 md:pb-24"
          variants={pageTransitions}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {children}
        </motion.main>
      </AnimatePresence>

      {/* Floating Dock Navigation */}
      <DockNavigation onAddDiscipline={handleAddDisciplineClick} />
      
      {/* Add Discipline Dialog */}
      <AddDisciplineDialog
        onAddDiscipline={handleAddDisciplineSubmit}
        onOpenChange={setShowDisciplineDialog}
        open={showDisciplineDialog}
      />
    </div>
  );
}