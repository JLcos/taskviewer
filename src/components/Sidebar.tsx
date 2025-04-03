
import { CalendarIcon, FolderIcon, LayoutDashboardIcon, BarChartIcon, ChevronLeftIcon, ChevronRightIcon, BookIcon, PlusIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function Sidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  
  const navItems = [
    { path: "/", label: "Painel", icon: <LayoutDashboardIcon size={20} /> },
    { path: "/calendario", label: "Calendário", icon: <CalendarIcon size={20} /> },
    { path: "/arquivos", label: "Arquivos", icon: <FolderIcon size={20} /> },
    { path: "/analiticos", label: "Analíticos", icon: <BarChartIcon size={20} /> },
  ];

  return (
    <aside className={`bg-sidebar h-screen flex-shrink-0 transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'} p-4 flex flex-col`}>
      <div className="flex items-center mb-8">
        {isOpen ? (
          <h1 className="text-sidebar-foreground text-xl font-bold">Task Viewer</h1>
        ) : (
          <h1 className="text-sidebar-foreground text-xl font-bold">TV</h1>
        )}
      </div>

      <nav className="flex flex-col space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "clay-nav-item",
              location.pathname === item.path && "clay-nav-item-active"
            )}
          >
            {item.icon}
            {isOpen && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      <div className="mt-8">
        <h2 className={cn("text-sidebar-foreground text-sm font-semibold mb-3", !isOpen && "text-center")}>
          {isOpen ? "Disciplinas" : ""}
        </h2>
        <button className="clay-nav-item w-full justify-center">
          <PlusIcon size={20} />
          {isOpen && <span>Adicionar Disciplina</span>}
        </button>
      </div>

      <div className="mt-auto">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="clay-nav-item w-full justify-center"
        >
          {isOpen ? <ChevronLeftIcon size={20} /> : <ChevronRightIcon size={20} />}
        </button>
      </div>
    </aside>
  );
}
