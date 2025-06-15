
import React, { useState } from 'react';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import CoffeeShopCard from '@/components/CoffeeShopCard';
import { coffeeShops, CoffeeShop } from '@/data/mockCoffeeShops';
import { Coffee } from 'lucide-react';

const Index = () => {
  const [searchResults, setSearchResults] = useState<CoffeeShop[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [city, setCity] = useState('');

  const handleSearch = (searchedCity: string) => {
    setCity(searchedCity);
    // Simulate API call and sorting
    console.log(`Searching for coffee shops in ${searchedCity}`);
    const sortedShops = [...coffeeShops].sort((a, b) => b.rating - a.rating);
    setSearchResults(sortedShops);
    setHasSearched(true);
  };
  
  const resetSearch = () => {
    setHasSearched(false);
    setCity('');
    setSearchResults([]);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {!hasSearched ? (
        <div className="flex h-screen flex-col items-center justify-center p-4">
           <div className="flex items-center space-x-4 mb-4">
              <Coffee className="h-16 w-16 text-primary" />
              <h1 className="text-6xl font-bold tracking-tighter">ChillCoffee</h1>
            </div>
          <p className="mb-8 text-xl text-muted-foreground">Discover the best specialty coffee shops in any city.</p>
          <SearchBar onSearch={handleSearch} />
        </div>
      ) : (
        <>
          <Header />
          <main className="container mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold">Top coffee spots in <span className="text-primary">{city}</span></h2>
                <p className="text-muted-foreground">Ranked by local connoisseurs and chill vibes. (Showing sample data)</p>
              </div>
              <button onClick={resetSearch} className="text-sm font-medium text-primary hover:underline">
                Search another city
              </button>
            </div>
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {searchResults.map((shop) => (
                <CoffeeShopCard key={shop.id} shop={shop} />
              ))}
            </div>
          </main>
        </>
      )}
    </div>
  );
};

export default Index;
