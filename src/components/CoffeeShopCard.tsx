
import { Star } from 'lucide-react';
import type { CoffeeShop } from '@/pages/Index';

interface CoffeeShopCardProps {
  shop: CoffeeShop;
}

const CoffeeShopCard = ({ shop }: CoffeeShopCardProps) => {
  const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(
    `${shop.name}, ${shop.city}`
  )}`;

  return (
    <a
      href={googleSearchUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group col-span-1 cursor-pointer"
    >
      <div className="flex w-full flex-col gap-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted">
          <img
            className="h-full w-full object-cover transition group-hover:scale-110"
            src={shop.image || '/placeholder.svg'}
            alt={shop.name}
            onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
          />
        </div>
        <div className="mt-2 flex justify-between">
          <div className="font-semibold truncate">{shop.name}</div>
          {shop.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
              {shop.rating.toFixed(1)}
            </div>
          )}
        </div>
        {shop.category && <div className="text-sm text-muted-foreground">{shop.category}</div>}
        {shop.description && <div className="text-sm text-muted-foreground truncate">{shop.description}</div>}
      </div>
    </a>
  );
};

export default CoffeeShopCard;
