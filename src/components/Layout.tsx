
import { Sidebar } from "@/components/Sidebar";
import { ReactNode } from "react";
import { BellIcon, UserIcon, SettingsIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b flex items-center justify-between px-6">
          <div className="flex-1 max-w-xl">
            <Input
              placeholder="Pesquisar tarefas, arquivos ou anotações..."
              className="clay-input"
              prefixIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5 text-muted-foreground"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                    clipRule="evenodd"
                  />
                </svg>
              }
            />
          </div>
          
          <div className="flex items-center gap-4">
            <button className="clay-button bg-white p-2">
              <BellIcon size={20} />
            </button>
            <button className="clay-button bg-white p-2">
              <SettingsIcon size={20} />
            </button>
            <button className="clay-button bg-white p-2">
              <UserIcon size={20} />
            </button>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
