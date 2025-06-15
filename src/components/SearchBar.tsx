
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  onSearch: (city: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [city, setCity] = useState('San Francisco');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="mx-auto mt-8 w-full max-w-2xl rounded-full border bg-background p-2 shadow-lg transition hover:shadow-xl dark:border-gray-700"
    >
      <div className="flex items-center">
        <Input
          type="text"
          placeholder="Which city are you chilling in?"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="h-12 flex-grow border-0 bg-transparent px-6 text-lg focus:ring-0 focus-visible:ring-offset-0"
        />
        <Button type="submit" size="lg" className="rounded-full bg-primary px-6 text-primary-foreground">
          <Search className="mr-2 h-5 w-5" />
          Search
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
