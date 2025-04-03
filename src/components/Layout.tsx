
import { Sidebar } from "@/components/Sidebar";
import { ReactNode } from "react";
import { BellIcon, UserIcon, SettingsIcon, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b flex items-center justify-between px-6 shadow-sm">
          <div className="flex-1 max-w-xl">
            <Input
              placeholder="Pesquisar tarefas, arquivos ou anotações..."
              className="clay-input"
              prefixIcon={<SearchIcon className="w-5 h-5 text-muted-foreground" />}
            />
          </div>
          
          <div className="flex items-center gap-4">
            <Button className="clay-button bg-white p-2 relative" variant="ghost" size="icon">
              <BellIcon size={20} />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </Button>
            <Button className="clay-button bg-white p-2" variant="ghost" size="icon">
              <SettingsIcon size={20} />
            </Button>
            <Avatar className="h-9 w-9 border-2 border-primary">
              <AvatarFallback className="bg-clay-blue text-blue-700">TV</AvatarFallback>
            </Avatar>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
