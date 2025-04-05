
import { Sidebar } from "@/components/Sidebar";
import { ReactNode } from "react";
import { SearchBar } from "@/components/SearchBar";
import { motion, AnimatePresence } from "framer-motion";

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

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar 
        disciplines={disciplines} 
        onAddDiscipline={onAddDiscipline} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <motion.header 
          className="h-16 border-b flex items-center justify-between px-6 shadow-sm bg-white/80 backdrop-blur-sm"
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
              >
                <SearchBar
                  onSearch={handleSearch}
                  placeholder={searchPlaceholder}
                  className="clay-input"
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
            className="flex-1 overflow-y-auto p-6"
            variants={pageTransitions}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}
