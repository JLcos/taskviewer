
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

interface SearchBarProps {
  onSearch: (term: string) => void;
  placeholder?: string;
  className?: string;
  initialValue?: string;
}

export function SearchBar({ onSearch, placeholder = "Pesquisar...", className = "", initialValue = "" }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, onSearch]);

  return (
    <div className={`relative w-full ${className}`}>
      <Input
        placeholder={placeholder}
        className="clay-input pr-10"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
        <SearchIcon className="w-5 h-5" />
      </div>
    </div>
  );
}
