
import React, { useState, useMemo } from 'react';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import CoffeeShopCard from '@/components/CoffeeShopCard';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

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
  can_work?: boolean;
  has_food?: boolean;
}

const Index = () => {
  const [city, setCity] = useState('');
  const [canWork, setCanWork] = useState(false);
  const [hasFood, setHasFood] = useState(false);
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
        .order('rating', { ascending: false, nullsFirst: false });

      if (error) {
        throw new Error(`Failed to fetch shops: ${error.message}`);
      }
      // NOTE: The 'can_work' and 'has_food' properties are not in the database.
      // They are added here with random values for demonstration purposes.
      // To implement this feature properly, you would need to:
      // 1. Add 'can_work' and 'has_food' columns (boolean) to the 'coffee_shops' table in your database.
      // 2. Update the scraping function to populate these fields.
      return (data || []).map((shop) => ({
        ...shop,
        can_work: Math.random() > 0.5,
        has_food: Math.random() > 0.5,
      }));
    },
    enabled: !!city,
  });

  const handleSearch = (searchedCity: string) => {
    setCity(searchedCity);
    scrapeAndFetch(searchedCity);
  };
  
  const resetSearch = () => {
    setCity('');
    setCanWork(false);
    setHasFood(false);
  }
  
  const hasSearched = !!city;
  const isLoading = isScraping || (hasSearched && isLoadingShops);

  const filteredResults = useMemo(() => {
    if (!searchResults) return [];
    return searchResults.filter(shop => {
        const canWorkPass = canWork ? shop.can_work : true;
        const hasFoodPass = hasFood ? shop.has_food : true;
        return canWorkPass && hasFoodPass;
    });
  }, [searchResults, canWork, hasFood]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {!hasSearched ? (
        <div className="flex h-screen flex-col items-center justify-center p-4">
           <h1 className="mb-4 text-6xl font-bold tracking-tighter">Bean There</h1>
          <p className="mb-8 max-w-lg text-center text-xl text-muted-foreground">Discover the specialty coffee shops in your city or the one you're headed to</p>
          <SearchBar onSearch={handleSearch} />
        </div>
      ) : (
        <>
          <Header />
          <main className="container mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold">Top coffee spots in <span className="text-primary">{city}</span></h2>
                <p className="text-muted-foreground">Sourced live from the web.</p>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <div className="flex items-center space-x-2">
                  <Switch id="can-work" checked={canWork} onCheckedChange={setCanWork} />
                  <Label htmlFor="can-work">Can work</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="has-food" checked={hasFood} onCheckedChange={setHasFood} />
                  <Label htmlFor="has-food">Has food</Label>
                </div>
                <button onClick={resetSearch} className="text-sm font-medium text-primary hover:underline">
                  Search another city
                </button>
              </div>
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
              filteredResults.length > 0 ? (
                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredResults.map((shop) => (
                    <CoffeeShopCard key={shop.id} shop={shop} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No coffee shops match your filters in "{city}".</p>
                  <p className="text-sm text-muted-foreground">Try adjusting your filters.</p>
                </div>
              )
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
