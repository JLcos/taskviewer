
import { Sidebar } from "@/components/Sidebar";
import { ReactNode, useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { motion, AnimatePresence } from "framer-motion";
import { MenuIcon, XIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile sidebar backdrop */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`${isMobile ? 'fixed top-0 bottom-0 left-0 z-50 transform transition-transform duration-300 ease-in-out' : ''} ${isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'}`}>
        <Sidebar 
          disciplines={disciplines} 
          onAddDiscipline={onAddDiscipline} 
        />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <motion.header 
          className="h-16 border-b flex items-center justify-between px-3 md:px-6 shadow-sm bg-white/80 backdrop-blur-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {isMobile && (
            <button 
              onClick={toggleSidebar}
              className="mr-2 p-2 rounded-lg hover:bg-slate-100"
            >
              {sidebarOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
            </button>
          )}
          
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
            className="flex-1 overflow-y-auto p-3 md:p-6"
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
