import Link from "next/link";
import { Gift, Search, Filter, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AIGiftAssistant } from "@/components/AIGiftAssistant";

export const dynamic = "force-dynamic";

export default async function GiftsCatalogue({ searchParams }: { searchParams: Promise<{ category?: string, ids?: string }> }) {
  const { category, ids } = await searchParams;
  
  let query = supabase.from('products').select('*');
  
  if (category && category !== 'Tous') {
    query = query.eq('category', category);
  }
  
  if (ids) {
    const idsArray = ids.split(',');
    query = query.in('id', idsArray);
  }

  const { data: gifts } = await query;
  const GIFTS = gifts || [];

  const categories = ["Tous", "Food", "Tech", "Expérience", "Maison", "Bien-être"];
  const currentCategory = category || "Tous";

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
            <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors hidden sm:block">
              Connexion
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Assistant IA */}
        <AIGiftAssistant />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            {ids ? "Sélection sur-mesure ✨" : "Tous les cadeaux"}
          </h1>
          {!ids && (
            <button className="flex items-center gap-2 text-sm font-medium border px-4 py-2 rounded-full hover:bg-muted transition-colors">
              <Filter className="w-4 h-4" />
              Filtres avancés
            </button>
          )}
        </div>

        {/* Categories */}
        {!ids && (
          <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <Link 
                key={cat} 
                href={cat === 'Tous' ? '/gifts' : `/gifts?category=${encodeURIComponent(cat)}`}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  currentCategory === cat 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-background border hover:bg-muted'
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        )}
        
        {ids && (
          <div className="mb-8">
            <Link href="/gifts" className="text-primary hover:underline text-sm font-medium">
              ← Retour à tout le catalogue
            </Link>
          </div>
        )}

        {/* Grid */}
        {GIFTS.length === 0 ? (
          <div className="text-center py-20 bg-card border rounded-3xl">
            <Gift className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold mb-2">Aucun cadeau trouvé</h3>
            <p className="text-muted-foreground">Essayez de modifier vos filtres.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {GIFTS.map((gift) => (
              <Link href={`/gifts/${gift.id}`} key={gift.id} className="group flex flex-col bg-card rounded-2xl border overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="aspect-square bg-muted relative overflow-hidden">
                  <img src={gift.image_url} alt={gift.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
        )}
      </main>
    </div>
  );
}
