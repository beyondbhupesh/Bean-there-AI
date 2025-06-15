
import { CoffeeShop } from '@/data/mockCoffeeShops';
import { Star } from 'lucide-react';

interface CoffeeShopCardProps {
  shop: CoffeeShop;
}

const CoffeeShopCard = ({ shop }: CoffeeShopCardProps) => {
  return (
    <div className="group col-span-1 cursor-pointer">
      <div className="flex w-full flex-col gap-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl">
          <img
            className="h-full w-full object-cover transition group-hover:scale-110"
            src={shop.image}
            alt={shop.name}
          />
        </div>
        <div className="mt-2 flex justify-between">
          <div className="font-semibold truncate">{shop.name}</div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
            {shop.rating.toFixed(1)}
          </div>
        </div>
        <div className="text-sm text-muted-foreground">{shop.category}</div>
        <div className="text-sm text-muted-foreground">{shop.description}</div>
      </div>
    </div>
  );
};

export default CoffeeShopCard;
