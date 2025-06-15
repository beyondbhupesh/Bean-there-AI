
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

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

    console.log(`Scraping coffee shops for city: ${city}`);
    
    const searchUrl = `https://www.yellowpages.com/search?search_terms=coffee&geo_location_terms=${encodeURIComponent(city)}`;
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from Yellow Pages: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    if (!doc) {
      throw new Error("Failed to parse HTML from Yellow Pages");
    }

    const scrapedShops: any[] = [];
    const results = doc.querySelectorAll('.result');

    for (const result of results) {
      const name = result.querySelector('a.business-name span')?.textContent?.trim();
      if (!name) continue;

      const category = result.querySelector('.categories a')?.textContent?.trim();
      const description = result.querySelector('.snippet-container .snippet-line-1')?.textContent?.trim();
      const image = result.querySelector('.media-thumbnail img')?.getAttribute('src');

      const tripAdvisorData = result.querySelector('.ratings')?.getAttribute('data-tripadvisor');
      let rating = null;
      let review_count = null;
      if (tripAdvisorData) {
        try {
          const taJson = JSON.parse(tripAdvisorData);
          rating = parseFloat(taJson.rating) || null;
          review_count = parseInt(taJson.count) || null;
        } catch (e) {
          console.error('Failed to parse TripAdvisor data', e);
        }
      }

      scrapedShops.push({
        name,
        rating,
        review_count,
        category: category || 'Coffee & Tea',
        price: null, // Not available from this source
        description,
        image,
        city,
      });
    }
    
    console.log(`Scraped ${scrapedShops.length} coffee shops from Yellow Pages.`);
    
    if (scrapedShops.length === 0) {
      return new Response(JSON.stringify({ data: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data, error } = await supabaseAdmin
      .from('coffee_shops')
      .upsert(scrapedShops, { onConflict: 'name,city' })
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
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
