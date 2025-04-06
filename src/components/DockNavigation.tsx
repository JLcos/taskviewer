
import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
  LayoutDashboardIcon,
  CalendarIcon,
  FolderIcon,
  BarChartIcon,
  BookOpenIcon,
  PlusIcon,
} from "lucide-react";
import { motion } from "framer-motion";

interface DockNavigationProps {
  onAddDiscipline: () => void;
}

export function DockNavigation({ onAddDiscipline }: DockNavigationProps) {
  const links = [
    {
      title: "Painel",
      icon: (
        <LayoutDashboardIcon className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/",
    },
    {
      title: "Calendário",
      icon: (
        <CalendarIcon className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/calendario",
    },
    {
      title: "Arquivos",
      icon: (
        <FolderIcon className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/arquivos",
    },
    {
      title: "Analíticos",
      icon: (
        <BarChartIcon className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/analiticos",
    },
    {
      title: "Disciplinas",
      icon: (
        <BookOpenIcon className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#disciplines",
    },
    {
      title: "Adicionar Disciplina",
      icon: (
        <PlusIcon className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
      onClick: onAddDiscipline
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50"
    >
      <FloatingDock
        items={links}
        mobileClassName="translate-y-0"
      />
    </motion.div>
  );
}
