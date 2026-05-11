"use client";

import { useState } from "react";
import Link from "next/link";
import { Gift, RefreshCw, CheckCircle2 } from "lucide-react";

// Mock catalog for swap
const SWAP_CATALOG = [
  { id: "s1", name: "Coffret Dégustation Truffes", category: "Food", image: "https://images.unsplash.com/photo-1605335035252-4fc88656d0d2?w=800&q=80" },
  { id: "s2", name: "Station de Charge Sans Fil en Noyer", category: "Tech", image: "https://images.unsplash.com/photo-1586810141695-1e374d6c4644?w=800&q=80" },
  { id: "s3", name: "Bouteille de Champagne Millésimé", category: "Food", image: "https://images.unsplash.com/photo-1595955610212-d3ba9281a8ae?w=800&q=80" },
  { id: "s4", name: "Bougie Parfumée Artisanale", category: "Maison", image: "https://images.unsplash.com/photo-1602928321679-560bb453f190?w=800&q=80" },
];

export default function SwapGift({ params }: { params: { magic_link: string } }) {
  const [selectedGift, setSelectedGift] = useState<string | null>(null);
  const [swapped, setSwapped] = useState(false);

  // Mock initial gift
  const initialGift = {
    senderName: "Thomas",
    productName: "Massage aux Pierres Chaudes",
    budget: 80, // Internal logic, not shown directly
  };

  if (swapped) {
    return (
      <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Échange confirmé !</h2>
        <p className="text-muted-foreground text-lg max-w-md mx-auto mb-8">
          Vous avez bien échangé votre cadeau contre <strong>{SWAP_CATALOG.find(g => g.id === selectedGift)?.name}</strong>. {initialGift.senderName} n'en saura rien, promis 🤫
        </p>
        <Link href={`/receive/${params.magic_link}?step=address`} className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold hover:bg-primary/90 transition-all inline-block">
          Passer à la livraison
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
      <header className="bg-background border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href={`/receive/${params.magic_link}`} className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            <span className="font-bold text-lg tracking-tight">Pleased</span>
          </Link>
          <div className="text-sm font-medium bg-muted px-3 py-1 rounded-full flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Mode Échange
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Choisissez ce qui vous fait vraiment plaisir</h1>
          <p className="text-muted-foreground text-lg">
            Ces cadeaux ont une valeur équivalente (ou inférieure) au cadeau initial offert par {initialGift.senderName}. 
            Les prix sont masqués pour garder la magie. La différence éventuelle sera convertie en bon d'achat.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {SWAP_CATALOG.map((gift) => (
            <div 
              key={gift.id} 
              onClick={() => setSelectedGift(gift.id)}
              className={`group flex flex-col bg-card rounded-2xl border overflow-hidden cursor-pointer transition-all ${selectedGift === gift.id ? 'ring-2 ring-primary ring-offset-2' : 'hover:border-primary/50'}`}
            >
              <div className="aspect-square bg-muted relative overflow-hidden">
                <img src={gift.image} alt={gift.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {selectedGift === gift.id && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <div className="bg-primary text-primary-foreground rounded-full p-2">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4 flex flex-col flex-grow text-center">
                <div className="text-xs font-semibold text-primary mb-1 uppercase tracking-wider">{gift.category}</div>
                <h3 className="font-medium leading-tight mb-2">{gift.name}</h3>
              </div>
            </div>
          ))}
        </div>

        {selectedGift && (
          <div className="fixed bottom-0 left-0 w-full bg-background border-t p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom-full z-50">
            <div className="container mx-auto flex items-center justify-between max-w-5xl">
              <div>
                <p className="text-sm text-muted-foreground">Vous avez sélectionné :</p>
                <p className="font-bold">{SWAP_CATALOG.find(g => g.id === selectedGift)?.name}</p>
              </div>
              <button 
                onClick={() => setSwapped(true)}
                className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all"
              >
                Valider l'échange
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
