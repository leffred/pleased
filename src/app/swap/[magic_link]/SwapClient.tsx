"use client";

import { useState } from "react";
import Link from "next/link";
import { Gift, RefreshCw, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";

type Product = {
  id: string;
  name: string;
  category: string;
  image_url: string;
  price: number;
};

export default function SwapClient({ 
  magicLink, 
  originalGift, 
  catalog 
}: { 
  magicLink: string;
  originalGift: { senderName: string, productName: string, price: number };
  catalog: Product[];
}) {
  const router = useRouter();
  const [selectedGift, setSelectedGift] = useState<string | null>(null);

  const handleValidate = () => {
    if (selectedGift) {
      router.push(`/receive/${magicLink}?step=address&swap=${selectedGift}`);
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
      <header className="bg-background border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href={`/receive/${magicLink}`} className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            <span className="font-bold text-lg tracking-tight">Pleased</span>
          </Link>
          <div className="text-sm font-medium bg-muted px-3 py-1 rounded-full flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Mode Échange
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 pb-32">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Choisissez ce qui vous fait vraiment plaisir</h1>
          <p className="text-muted-foreground text-lg">
            Ces cadeaux ont une valeur équivalente (ou inférieure) au cadeau initial offert par <span className="font-medium text-foreground">{originalGift.senderName}</span>. 
            Les prix sont masqués pour garder la magie.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto"
        >
          {catalog.map((gift) => (
            <motion.div 
              variants={itemVariants}
              key={gift.id} 
              onClick={() => setSelectedGift(gift.id)}
              className={`group flex flex-col bg-card rounded-2xl border overflow-hidden cursor-pointer transition-all duration-300 ${selectedGift === gift.id ? 'ring-2 ring-primary ring-offset-2 scale-[1.02] shadow-xl' : 'hover:border-primary/50 hover:-translate-y-1 hover:shadow-lg'}`}
            >
              <div className="aspect-square bg-muted relative overflow-hidden">
                <img src={gift.image_url} alt={gift.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
            </motion.div>
          ))}
          {catalog.length === 0 && (
             <div className="col-span-full text-center py-12 text-muted-foreground">
               Aucun cadeau alternatif n'est disponible pour ce budget.
             </div>
          )}
        </motion.div>

        {selectedGift && (
          <div className="fixed bottom-0 left-0 w-full bg-background border-t p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom-full z-50">
            <div className="container mx-auto flex items-center justify-between max-w-5xl">
              <div>
                <p className="text-sm text-muted-foreground">Vous avez sélectionné :</p>
                <p className="font-bold">{catalog.find(g => g.id === selectedGift)?.name}</p>
              </div>
              <button 
                onClick={handleValidate}
                className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all"
              >
                Passer à la livraison
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
