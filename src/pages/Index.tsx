
import React, { useState } from 'react';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import CoffeeShopCard from '@/components/CoffeeShopCard';
import { Coffee } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';

export interface CoffeeShop {
  id: number;
  name: string;
  rating: number | null;
  review_count: number | null;
  category: string | null;
  price: string | null;
  description: string | null;
  image: string | null;
  city: string;
  created_at: string;
}

const Index = () => {
  const [city, setCity] = useState('');
  const queryClient = useQueryClient();

  const { mutate: scrapeAndFetch, isPending: isScraping } = useMutation({
    mutationFn: async (searchCity: string) => {
      const { error } = await supabase.functions.invoke('scrape-coffee-shops', {
        body: { city: searchCity },
      });

      if (error) {
        throw new Error(`Failed to scrape: ${error.message}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coffeeShops', city] });
    },
    onError: (error) => {
      toast({
        title: "Scraping Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const { data: searchResults, isLoading: isLoadingShops } = useQuery<CoffeeShop[]>({
    queryKey: ['coffeeShops', city],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coffee_shops')
        .select('*')
        .eq('city', city)
        .order('rating', { ascending: false, nulls: 'last' });

      if (error) {
        throw new Error(`Failed to fetch shops: ${error.message}`);
      }
      return data || [];
    },
    enabled: !!city,
  });

  const handleSearch = (searchedCity: string) => {
    setCity(searchedCity);
    scrapeAndFetch(searchedCity);
  };
  
  const resetSearch = () => {
    setCity('');
  }
  
  const hasSearched = !!city;
  const isLoading = isScraping || (hasSearched && isLoadingShops);

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
                <p className="text-muted-foreground">Sourced live from the web. (Using sample data for now)</p>
              </div>
              <button onClick={resetSearch} className="text-sm font-medium text-primary hover:underline">
                Search another city
              </button>
            </div>
            {isLoading ? (
              <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="group col-span-1">
                    <Skeleton className="aspect-square w-full rounded-xl" />
                    <Skeleton className="mt-4 h-4 w-3/4" />
                    <Skeleton className="mt-2 h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : searchResults && searchResults.length > 0 ? (
              <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {searchResults.map((shop) => (
                  <CoffeeShopCard key={shop.id} shop={shop} />
                ))}
              </div>
            ) : (
                <div className="text-center py-10">
                    <p className="text-muted-foreground">No coffee shops found for "{city}".</p>
                    <p className="text-sm text-muted-foreground">Try another city!</p>
                </div>
            )}
          </main>
        </>
      )}
    </div>
  );
};

export default Index;
