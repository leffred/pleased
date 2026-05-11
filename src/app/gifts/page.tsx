import Link from "next/link";
import { Gift, Search, Filter } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default async function GiftsCatalogue() {
  const { data: gifts } = await supabase.from('products').select('*');
  const GIFTS = gifts || [];

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
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 text-muted-foreground hover:text-foreground">
              <Search className="w-5 h-5" />
            </button>
            <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors hidden sm:block">
              Connexion
            </Link>
          </div>
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
