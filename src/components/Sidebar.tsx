
import { CalendarIcon, FolderIcon, LayoutDashboardIcon, BarChartIcon, ChevronLeftIcon, ChevronRightIcon, PlusIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { AddDisciplineDialog } from "@/components/AddDisciplineDialog";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  disciplines: string[];
  onAddDiscipline: (name: string) => void;
}

export function Sidebar({ disciplines, onAddDiscipline }: SidebarProps) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  
  const navItems = [
    { path: "/", label: "Painel", icon: <LayoutDashboardIcon size={20} /> },
    { path: "/calendario", label: "Calendário", icon: <CalendarIcon size={20} /> },
    { path: "/arquivos", label: "Arquivos", icon: <FolderIcon size={20} /> },
    { path: "/analiticos", label: "Analíticos", icon: <BarChartIcon size={20} /> },
  ];

  const sidebarVariants = {
    open: { width: "16rem" },
    closed: { width: "5rem" }
  };

  const textVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: -10 }
  };

  return (
    <motion.aside 
      className="bg-sidebar h-screen flex-shrink-0 transition-all duration-300 p-4 flex flex-col"
      animate={isOpen ? "open" : "closed"}
      variants={sidebarVariants}
      transition={{ duration: 0.3, type: "spring", stiffness: 100 }}
    >
      <motion.div className="flex items-center mb-8">
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.h1 
              key="full-title" 
              className="text-sidebar-foreground text-xl font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              Task Viewer
            </motion.h1>
          ) : (
            <motion.h1 
              key="short-title" 
              className="text-sidebar-foreground text-xl font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              TV
            </motion.h1>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.nav className="flex flex-col space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "clay-nav-item",
              location.pathname === item.path && "clay-nav-item-active"
            )}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center"
            >
              {item.icon}
              <AnimatePresence mode="wait">
                {isOpen && (
                  <motion.span
                    variants={textVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </Link>
        ))}
      </motion.nav>

      <div className="mt-8">
        <motion.h2 
          variants={textVariants}
          className={cn("text-sidebar-foreground text-sm font-semibold mb-3", !isOpen && "text-center")}
        >
          {isOpen ? "Disciplinas" : ""}
        </motion.h2>
        <AddDisciplineDialog 
          onAddDiscipline={onAddDiscipline}
          trigger={
            <motion.button 
              className="clay-nav-item w-full justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <PlusIcon size={20} />
              <AnimatePresence mode="wait">
                {isOpen && (
                  <motion.span
                    variants={textVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                  >
                    Adicionar Disciplina
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          }
        />
      </div>

      <div className="mt-auto">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="clay-nav-item w-full justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isOpen ? <ChevronLeftIcon size={20} /> : <ChevronRightIcon size={20} />}
        </motion.button>
      </div>
    </motion.aside>
  );
}
