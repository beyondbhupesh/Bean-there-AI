
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { city } = await req.json()
    if (!city) {
      return new Response(JSON.stringify({ error: 'City is required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    console.log(`Fetching coffee shops for city: ${city} from Google Places API`);
    
    const apiKey = Deno.env.get('GOOGLE_PLACES_API_KEY');
    if (!apiKey) {
      throw new Error("GOOGLE_PLACES_API_KEY is not set in Supabase secrets.");
    }
    
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=coffee shops in ${encodeURIComponent(city)}&key=${apiKey}`;
    
    const response = await fetch(searchUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch from Google Places API: ${response.status} ${response.statusText}`);
    }

    const googleData = await response.json();

    if (googleData.status !== 'OK' && googleData.status !== 'ZERO_RESULTS') {
      throw new Error(`Google Places API Error: ${googleData.status} - ${googleData.error_message || 'No error message provided.'}`);
    }
    
    const scrapedShops: any[] = [];
    if (googleData.results) {
        for (const place of googleData.results) {
            const image = place.photos && place.photos.length > 0 
                ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${apiKey}`
                : null;

            const price = place.price_level ? '$'.repeat(place.price_level) : null;

            scrapedShops.push({
                name: place.name,
                rating: place.rating || null,
                review_count: place.user_ratings_total || null,
                category: place.types?.includes('cafe') ? 'Cafe' : 'Coffee Shop',
                price,
                description: place.formatted_address, // Using address as description
                image,
                city,
            });
        }
    }
    
    console.log(`Found ${scrapedShops.length} coffee shops from Google Places.`);

    // De-duplicate shops from the API response
    const uniqueShopsMap = new Map();
    scrapedShops.forEach(shop => {
      const key = `${shop.name}|${shop.city}`;
      if (!uniqueShopsMap.has(key)) {
        uniqueShopsMap.set(key, shop);
      }
    });
    const uniqueScrapedShops = Array.from(uniqueShopsMap.values());
    console.log(`Found ${uniqueScrapedShops.length} unique coffee shops from scraping.`);
    
    if (uniqueScrapedShops.length === 0) {
      return new Response(JSON.stringify({ data: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("Supabase project environment variables are not set.");
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    // Fetch shops already in our DB for the given city
    const { data: existingShops, error: fetchError } = await supabaseAdmin
      .from('coffee_shops')
      .select('name')
      .eq('city', city);

    if (fetchError) {
      console.error('Error fetching existing shops:', fetchError);
      throw fetchError;
    }
    
    const existingShopNames = new Set(existingShops.map(s => s.name));
    
    // Filter out shops that are already in the database
    const newShopsToInsert = uniqueScrapedShops.filter(s => !existingShopNames.has(s.name));

    console.log(`Found ${newShopsToInsert.length} new coffee shops to insert.`);

    if (newShopsToInsert.length === 0) {
      return new Response(JSON.stringify({ data: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Insert only the new shops
    const { data, error } = await supabaseAdmin
      .from('coffee_shops')
      .insert(newShopsToInsert)
      .select()

    if (error) {
      console.error('Error inserting new data:', error)
      throw error
    }

    return new Response(JSON.stringify({ data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
