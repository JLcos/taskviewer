
import { Sidebar } from "@/components/Sidebar";
import { ReactNode } from "react";
import { BellIcon, UserIcon, SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SearchBar } from "@/components/SearchBar";
import { motion } from "framer-motion";

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
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar 
        disciplines={disciplines} 
        onAddDiscipline={onAddDiscipline} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <motion.header 
          className="h-16 border-b flex items-center justify-between px-6 shadow-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex-1 max-w-xl">
            {onSearch ? (
              <SearchBar
                onSearch={handleSearch}
                placeholder={searchPlaceholder}
                className="clay-input"
              />
            ) : (
              <div className="h-10"></div> 
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="clay-button bg-white p-2 relative" variant="ghost" size="icon">
                <BellIcon size={20} />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="clay-button bg-white p-2" variant="ghost" size="icon">
                <SettingsIcon size={20} />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Avatar className="h-9 w-9 border-2 border-primary">
                <AvatarFallback className="bg-clay-blue text-blue-700">TV</AvatarFallback>
              </Avatar>
            </motion.div>
          </div>
        </motion.header>
        
        <motion.main 
          className="flex-1 overflow-y-auto p-6"
          variants={pageTransitions}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
