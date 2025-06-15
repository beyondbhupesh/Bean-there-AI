
export interface CoffeeShop {
  id: number;
  name: string;
  rating: number;
  reviewCount: number;
  category: string;
  price: '$$' | '$$$' | '$';
  description: string;
  image: string;
}

export const coffeeShops: CoffeeShop[] = [
  {
    id: 1,
    name: "Ritual Coffee Roasters",
    rating: 4.8,
    reviewCount: 1245,
    category: "Specialty Coffee",
    price: '$$',
    description: "A pioneer in SF's coffee scene, known for its meticulous sourcing and roasting.",
    image: "https://images.unsplash.com/photo-1559496417-50b3c4c0422c?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Four Barrel Coffee",
    rating: 4.7,
    reviewCount: 987,
    category: "Artisan Roaster",
    price: '$$',
    description: "Hip, bustling cafe with house-roasted beans and a focus on pour-over coffee.",
    image: "https://images.unsplash.com/photo-1511920183353-3c2c58625350?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Blue Bottle Coffee",
    rating: 4.6,
    reviewCount: 2310,
    category: "Third Wave Coffee",
    price: '$$$',
    description: "Iconic coffee roaster with a cult following, serving single-origin drip & espresso.",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Sightglass Coffee",
    rating: 4.7,
    reviewCount: 1532,
    category: "Industrial Chic",
    price: '$$',
    description: "Spacious, stylish roastery and cafe with a focus on transparency and quality.",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 5,
    name: "Andytown Coffee Roasters",
    rating: 4.9,
    reviewCount: 876,
    category: "Cozy Neighborhood Spot",
    price: '$$',
    description: "Charming, Irish-inspired coffee shop famous for its Snowy Plover.",
    image: "https://images.unsplash.com/photo-1525648273439-d58c973c1747?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 6,
    name: "Saint Frank Coffee",
    rating: 4.6,
    reviewCount: 654,
    category: "Minimalist & Modern",
    price: '$$$',
    description: "A bright, minimalist cafe serving carefully sourced single-origin coffees.",
    image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 7,
    name: "Verve Coffee Roasters",
    rating: 4.5,
    reviewCount: 789,
    category: "Santa Cruz Vibe",
    price: '$$',
    description: "Laid-back, surf-inspired cafe with excellent coffee and friendly baristas.",
    image: "https://images.unsplash.com/photo-1495474472287-4d713b22e8b4?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 8,
    name: "Flywheel Coffee Roasters",
    rating: 4.8,
    reviewCount: 432,
    category: "Family-Owned Roaster",
    price: '$$',
    description: "Exposed-brick space with a vintage roaster, serving single-origin espresso & pour-overs.",
    image: "https://images.unsplash.com/photo-1507135967348-efece38ac122?q=80&w=800&auto=format&fit=crop"
  }
];
