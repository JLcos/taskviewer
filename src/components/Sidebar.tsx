
import { CalendarIcon, FolderIcon, LayoutDashboardIcon, BarChartIcon, ChevronLeftIcon, ChevronRightIcon, PlusIcon, BookOpenIcon } from "lucide-react";
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
  const [isHovering, setIsHovering] = useState(false);
  
  const navItems = [
    { path: "/", label: "Painel", icon: <LayoutDashboardIcon size={20} /> },
    { path: "/calendario", label: "Calendário", icon: <CalendarIcon size={20} /> },
    { path: "/arquivos", label: "Arquivos", icon: <FolderIcon size={20} /> },
    { path: "/analiticos", label: "Analíticos", icon: <BarChartIcon size={20} /> },
  ];

  const sidebarVariants = {
    open: { width: "16rem", transition: { type: "spring", stiffness: 300, damping: 30 } },
    closed: { width: "5rem", transition: { type: "spring", stiffness: 300, damping: 30 } }
  };

  const textVariants = {
    open: { opacity: 1, x: 0, display: "block", transition: { delay: 0.1, duration: 0.2 } },
    closed: { 
      opacity: 0, 
      x: -10, 
      transitionEnd: { 
        display: "none"
      },
      transition: { duration: 0.2 } 
    }
  };

  const iconVariants = {
    open: { rotate: 0 },
    closed: { rotate: 0 },
    hover: { scale: 1.1, rotate: 5, transition: { duration: 0.2 } }
  };
  
  const navItemsGap = isOpen ? "gap-3" : "gap-0";

  return (
    <motion.aside 
      className="bg-sidebar h-screen flex-shrink-0 transition-all duration-300 p-4 flex flex-col relative overflow-hidden shadow-lg"
      initial="open"
      animate={isOpen ? "open" : "closed"}
      variants={sidebarVariants}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
    >
      {/* Glass overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-600/20 to-transparent pointer-events-none" />
      
      <motion.div className="flex items-center mb-8 relative z-10">
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div 
              className="flex items-center gap-2"
              key="full-title" 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                variants={iconVariants}
                initial="open"
                animate={isHovering ? "hover" : "open"}
                className="text-sidebar-foreground text-2xl font-bold bg-sidebar-accent rounded-md p-1"
              >
                <BookOpenIcon size={24} />
              </motion.div>
              <h1 className="text-sidebar-foreground text-xl font-bold">
                Task Viewer
              </h1>
            </motion.div>
          ) : (
            <motion.div 
              key="short-title" 
              className="mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                variants={iconVariants}
                initial="closed"
                animate={isHovering ? "hover" : "closed"}
                className="text-sidebar-foreground text-2xl font-bold bg-sidebar-accent rounded-md p-1"
              >
                <BookOpenIcon size={24} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.nav className="flex flex-col space-y-1 z-10">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "clay-nav-item overflow-hidden",
              location.pathname === item.path ? "clay-nav-item-active" : "",
              !isOpen && "justify-center"
            )}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center ${navItemsGap} w-full`}
            >
              <motion.div
                whileHover={{ rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                {item.icon}
              </motion.div>
              <motion.span
                variants={textVariants}
                className="whitespace-nowrap"
              >
                {item.label}
              </motion.span>
            </motion.div>
          </Link>
        ))}
      </motion.nav>

      <div className="mt-8 z-10">
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
              className={cn("clay-nav-item w-full", !isOpen && "justify-center")}
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <PlusIcon size={20} />
              </motion.div>
              <motion.span
                variants={textVariants}
              >
                Adicionar Disciplina
              </motion.span>
            </motion.button>
          }
        />
        
        {isOpen && disciplines.length > 0 && (
          <motion.div 
            className="mt-2 space-y-1 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-sidebar-accent scrollbar-track-transparent pr-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {disciplines.map((discipline, index) => (
              <motion.div
                key={discipline}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="clay-nav-item py-2 text-sm truncate"
              >
                {discipline}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <motion.div 
        className="mt-auto pt-4 z-10"
        layout
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className={cn("clay-nav-item w-full", !isOpen && "justify-center")}
          whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="chevron-left"
                initial={{ opacity: 0, rotate: 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -90 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronLeftIcon size={20} />
              </motion.div>
            ) : (
              <motion.div
                key="chevron-right"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRightIcon size={20} />
              </motion.div>
            )}
          </AnimatePresence>
          <motion.span
            variants={textVariants}
          >
            {isOpen ? "Recolher menu" : ""}
          </motion.span>
        </motion.button>
      </motion.div>
    </motion.aside>
  );
}
