
import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { popularCities } from '@/data/popularCities';

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

  return (
    <form
      onSubmit={handleSearch}
      className="mx-auto mt-8 w-full max-w-2xl"
    >
      <div
        ref={searchContainerRef}
        className="relative w-full"
      >
        <Command className="overflow-visible rounded-full border bg-background shadow-lg transition hover:shadow-xl dark:border-gray-700">
          <div className="flex items-center p-2">
            <div className="flex-grow">
              <CommandInput
                placeholder="Which city are you chilling in?"
                value={inputValue}
                onValueChange={setInputValue}
                onFocus={() => setShowSuggestions(true)}
                className="h-12 w-full border-0 bg-transparent px-6 text-lg focus:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <Button type="submit" size="lg" className="rounded-full bg-primary px-6 text-primary-foreground">
              <Search className="mr-2 h-5 w-5" />
              Brew
            </Button>
          </div>
          {showSuggestions && (
            <CommandList className="absolute top-full z-50 mt-2 w-full rounded-md border bg-popover text-popover-foreground shadow-md">
              <CommandEmpty>No city found.</CommandEmpty>
              <CommandGroup heading="Suggestions">
                {popularCities.map((city) => (
                  <CommandItem
                    key={city}
                    value={city}
                    onSelect={(currentValue) => {
                      const selectedCity = popularCities.find(c => c.toLowerCase() === currentValue) || city;
                      setInputValue(selectedCity);
                      setShowSuggestions(false);
                    }}
                  >
                    {city}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          )}
        </Command>
      </div>
    </form>
  );
};

export default SearchBar;
