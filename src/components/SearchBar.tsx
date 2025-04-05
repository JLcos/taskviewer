
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

  // Effect to debounce search input
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, onSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative group">
        <Input
          placeholder={placeholder}
          className="clay-input pl-10 pr-4 transition-all duration-300 focus:shadow-clay-hover"
          value={searchTerm}
          onChange={handleInputChange}
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-hover:text-primary transition-colors duration-300">
          <SearchIcon className="w-5 h-5" />
        </div>
        {searchTerm && (
          <button 
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors duration-300 p-1 rounded-full hover:bg-gray-100"
            onClick={() => {
              setSearchTerm("");
              onSearch("");
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
