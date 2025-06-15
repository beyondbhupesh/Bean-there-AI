
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// These are placeholder and would need to be replaced with a real scraping implementation.
const MOCK_SCRAPED_DATA = [
  {
    name: 'Scraped Philz Coffee',
    rating: 4.5,
    review_count: 1200,
    category: 'Specialty Coffee',
    price: '$$',
    description: 'A very chill place with many pour-over options.',
    image: 'https://images.unsplash.com/photo-1551882232-e42a581d8a23?q=80&w=2070&auto=format&fit=crop'
  },
  {
    name: 'Scraped Blue Bottle Coffee',
    rating: 4.8,
    review_count: 2500,
    category: 'Third Wave Coffee',
    price: '$$$',
    description: 'Minimalist decor and amazing single-origin coffees.',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1887&auto=format&fit=crop'
  },
  {
    name: 'Ritual Coffee Roasters',
    rating: 4.6,
    review_count: 1800,
    category: 'Artisanal Coffee',
    price: '$$',
    description: 'Pioneers in the coffee scene, known for their meticulous sourcing.',
    image: 'https://images.unsplash.com/photo-1511920183353-3c7c95a5742c?q=80&w=1887&auto=format&fit=crop'
  },
];

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
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

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log(`"Scraping" coffee shops for city: ${city}`);
    const coffeeShopsToInsert = MOCK_SCRAPED_DATA.map(shop => ({
      ...shop,
      city: city, 
    }));

    const { data, error } = await supabaseAdmin
      .from('coffee_shops')
      .upsert(coffeeShopsToInsert, { onConflict: 'name,city' })
      .select()

    if (error) {
      console.error('Error upserting data:', error)
      throw error
    }

    return new Response(JSON.stringify({ data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
