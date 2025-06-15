
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { popularCities } from '@/data/popularCities';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (city: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [inputValue, setInputValue] = useState('San Francisco');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue.trim());
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = useCallback((currentValue: string) => {
    setInputValue(currentValue);
    setShowSuggestions(false);
  }, []);

  const filteredCities = popularCities.filter((city) => city.toLowerCase().includes(inputValue.toLowerCase()));

  return (
    <form
      onSubmit={handleSearch}
      className="mx-auto mt-8 w-full max-w-2xl"
    >
      <div
        ref={searchContainerRef}
        className="relative w-full"
      >
        <div className="flex items-center rounded-full border bg-background p-2 shadow-lg transition hover:shadow-xl dark:border-gray-700">
            <Search className="ml-2 mr-4 h-5 w-5 shrink-0 text-muted-foreground" />
            <Command shouldFilter={false} className="flex-grow overflow-visible bg-transparent">
              <CommandInput
                placeholder="Which city are you chilling in?"
                value={inputValue}
                onValueChange={setInputValue}
                onFocus={() => setShowSuggestions(true)}
                className="h-12 w-full border-0 bg-transparent p-0 text-lg focus:ring-0 focus-visible:ring-offset-0"
              />
              <CommandList className={cn("absolute left-0 top-full z-50 mt-2 w-full rounded-md border bg-popover text-popover-foreground shadow-md", { 'hidden': !showSuggestions })}>
                {filteredCities.length > 0 ? (
                  <CommandGroup heading="Suggestions">
                    {filteredCities.map((city) => (
                      <CommandItem
                        key={city}
                        value={city}
                        onSelect={handleSelect}
                      >
                        {city}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ) : (
                  <CommandEmpty>No city found.</CommandEmpty>
                )}
              </CommandList>
            </Command>
          <Button type="submit" size="lg" className="ml-2 rounded-full bg-primary px-6 text-primary-foreground">
              <Search className="mr-2 h-5 w-5" />
              Brew
            </Button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
