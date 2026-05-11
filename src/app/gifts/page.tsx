import Link from "next/link";
import { Gift, Search, Filter } from "lucide-react";

// Fake data for the MVP
const GIFTS = [
  { id: "1", name: "Coffret Dégustation Truffes", price: 65, category: "Food", image: "https://images.unsplash.com/photo-1605335035252-4fc88656d0d2?w=800&q=80" },
  { id: "2", name: "Casque Audio Premium", price: 95, category: "Tech", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80" },
  { id: "3", name: "Massage aux Pierres Chaudes", price: 80, category: "Expérience", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80" },
  { id: "4", name: "Bouteille de Champagne Millésimé", price: 75, category: "Food", image: "https://images.unsplash.com/photo-1595955610212-d3ba9281a8ae?w=800&q=80" },
  { id: "5", name: "Station de Charge Sans Fil en Noyer", price: 55, category: "Tech", image: "https://images.unsplash.com/photo-1586810141695-1e374d6c4644?w=800&q=80" },
  { id: "6", name: "Dîner Croisière pour Deux", price: 100, category: "Expérience", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80" },
];

export default function GiftsCatalogue() {
  return (
    <div className="min-h-screen bg-muted/20">
      {/* Header compact */}
      <header className="bg-background border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            <span className="font-bold text-lg tracking-tight">Pleased</span>
          </Link>
          <div className="flex-1 max-w-md mx-8 hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Rechercher un cadeau..." 
                className="w-full pl-10 pr-4 py-2 bg-muted rounded-full text-sm border-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>
          </div>
          <button className="md:hidden p-2 text-muted-foreground hover:text-foreground">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Tous les cadeaux</h1>
          <button className="flex items-center gap-2 text-sm font-medium border px-4 py-2 rounded-full hover:bg-muted transition-colors">
            <Filter className="w-4 h-4" />
            Filtrer
          </button>
        </div>

        {/* Categories (Fake) */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {["Tous", "Food", "Tech", "Expérience", "Maison", "Bien-être"].map((cat) => (
            <button key={cat} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${cat === 'Tous' ? 'bg-primary text-primary-foreground' : 'bg-background border hover:bg-muted transition-colors'}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {GIFTS.map((gift) => (
            <Link href={`/gifts/${gift.id}`} key={gift.id} className="group flex flex-col bg-card rounded-2xl border overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="aspect-square bg-muted relative overflow-hidden">
                <img src={gift.image} alt={gift.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <div className="text-xs font-semibold text-primary mb-1 uppercase tracking-wider">{gift.category}</div>
                <h3 className="font-medium text-lg leading-tight mb-2 line-clamp-2">{gift.name}</h3>
                <div className="mt-auto pt-4 flex items-center justify-between">
                  <span className="font-bold">{gift.price} €</span>
                  <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">Offrir</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
