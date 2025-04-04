
import { Sidebar } from "@/components/Sidebar";
import { ReactNode } from "react";
import { BellIcon, UserIcon, SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

  const staggerAnimationProps = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemAnimationProps = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
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
          
          <motion.div 
            className="flex items-center gap-4"
            variants={staggerAnimationProps}
            initial="initial"
            animate="animate"
          >
            <motion.div 
              variants={itemAnimationProps}
              whileHover={{ scale: 1.1 }} 
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Button className="clay-button bg-white p-2" variant="ghost" size="icon">
                <BellIcon size={20} />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full">
                  <motion.span 
                    className="absolute inset-0 rounded-full bg-red-500"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </span>
              </Button>
            </motion.div>
            <motion.div 
              variants={itemAnimationProps}
              whileHover={{ scale: 1.1 }} 
              whileTap={{ scale: 0.95 }}
            >
              <Button className="clay-button bg-white p-2" variant="ghost" size="icon">
                <SettingsIcon size={20} />
              </Button>
            </motion.div>
            <motion.div 
              variants={itemAnimationProps}
              whileHover={{ 
                scale: 1.1,
                rotate: [0, 5, 0, -5, 0],
                transition: { duration: 0.5 }
              }}
            >
              <Avatar className="h-9 w-9 border-2 border-primary">
                <AvatarFallback className="bg-clay-blue text-blue-700">TV</AvatarFallback>
              </Avatar>
            </motion.div>
          </motion.div>
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
