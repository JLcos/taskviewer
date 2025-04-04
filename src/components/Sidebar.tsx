
import { CalendarIcon, FolderIcon, LayoutDashboardIcon, BarChartIcon, BookOpenIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { AddDisciplineDialog } from "@/components/AddDisciplineDialog";
import { motion } from "framer-motion";

interface SidebarProps {
  disciplines: string[];
  onAddDiscipline: (name: string) => void;
}

export function Sidebar({ disciplines, onAddDiscipline }: SidebarProps) {
  const location = useLocation();
  const [isHovering, setIsHovering] = useState(false);
  
  const navItems = [
    { path: "/", label: "Painel", icon: <LayoutDashboardIcon size={20} /> },
    { path: "/calendario", label: "Calendário", icon: <CalendarIcon size={20} /> },
    { path: "/arquivos", label: "Arquivos", icon: <FolderIcon size={20} /> },
    { path: "/analiticos", label: "Analíticos", icon: <BarChartIcon size={20} /> },
  ];

  const iconVariants = {
    hover: { scale: 1.1, rotate: 5, transition: { duration: 0.2 } }
  };

  return (
    <aside 
      className="bg-sidebar h-screen w-64 flex-shrink-0 p-4 flex flex-col relative overflow-hidden shadow-lg"
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
    >
      {/* Glass overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-600/20 to-transparent pointer-events-none" />
      
      <div className="flex items-center mb-8 relative z-10">
        <div className="flex items-center gap-2">
          <motion.div
            variants={iconVariants}
            whileHover="hover"
            className="text-sidebar-foreground text-2xl font-bold bg-sidebar-accent rounded-md p-1"
          >
            <BookOpenIcon size={24} />
          </motion.div>
          <h1 className="text-sidebar-foreground text-xl font-bold">
            Task Viewer
          </h1>
        </div>
      </div>

      <motion.nav className="flex flex-col space-y-1 z-10">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "clay-nav-item overflow-hidden",
              location.pathname === item.path ? "clay-nav-item-active" : ""
            )}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 w-full"
            >
              <motion.div
                whileHover={{ rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                {item.icon}
              </motion.div>
              <span className="whitespace-nowrap">
                {item.label}
              </span>
            </motion.div>
          </Link>
        ))}
      </motion.nav>

      <div className="mt-8 z-10">
        <h2 className="text-sidebar-foreground text-sm font-semibold mb-3">
          Disciplinas
        </h2>
        <AddDisciplineDialog 
          onAddDiscipline={onAddDiscipline}
          trigger={
            <motion.button 
              className="clay-nav-item w-full"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                +
              </motion.div>
              <span>
                Adicionar Disciplina
              </span>
            </motion.button>
          }
        />
        
        {disciplines.length > 0 && (
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
    </aside>
  );
}
