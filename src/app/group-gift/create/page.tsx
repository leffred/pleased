"use client";

import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Users, ArrowRight, ArrowLeft, Calendar, Gift } from "lucide-react";
import { supabase } from "@/lib/supabase";

function CreateGroupGiftContent() {
  const searchParams = useSearchParams();
  const giftId = searchParams.get("giftId");
  
  const [selectedGift, setSelectedGift] = useState<any>(null);
  
  useEffect(() => {
    if (giftId) {
      supabase.from('products').select('*').eq('id', giftId).single().then(({ data }) => {
        if (data) setSelectedGift(data);
      });
    }
  }, [giftId]);

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [recipient, setRecipient] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      // Simulate creation
      setStep(3);
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-4">
      <Link href="/" className="flex items-center gap-2 mb-8 text-foreground hover:opacity-80 transition-opacity">
        <Users className="w-8 h-8 text-primary" />
        <span className="font-bold text-2xl tracking-tight">Cagnotte</span>
      </Link>

      <div className="w-full max-w-xl bg-card rounded-3xl p-8 shadow-xl border relative overflow-hidden">
        
        {/* Progress bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-muted">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out" 
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {step === 3 ? (
          <div className="text-center animate-in zoom-in fade-in duration-500 py-4">
            <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Cagnotte créée !</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Invitez vos amis à participer. S'ils atteignent l'objectif, le cadeau sera envoyé.
            </p>
            
            <div className="bg-muted p-4 rounded-xl flex items-center justify-between mb-8">
              <span className="text-sm font-medium truncate mr-4">https://pleased.fr/group-gift/abc-123</span>
              <button className="bg-foreground text-background px-4 py-2 rounded-lg text-sm font-bold hover:bg-foreground/90 transition-all shrink-0">
                Copier
              </button>
            </div>

            <Link href="/dashboard" className="text-primary font-medium hover:underline">
              Aller à mon tableau de bord
            </Link>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            {step > 1 && (
              <button onClick={() => setStep(step - 1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Retour
              </button>
            )}
            
            <h2 className="text-3xl font-bold mb-2">
              {step === 1 ? "Détails de la cagnotte" : "Échéance"}
            </h2>
            <p className="text-muted-foreground mb-8">
              {step === 1 ? "Nous préparons le cadeau de groupe." : "Quand se termine la cagnotte ?"}
            </p>

            {selectedGift && step === 1 && (
              <div className="flex items-center gap-4 bg-muted p-4 rounded-xl mb-6">
                <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                  <img src={selectedGift.image} alt={selectedGift.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Objectif de la cagnotte :</p>
                  <p className="font-bold line-clamp-1">{selectedGift.name}</p>
                  <p className="text-primary font-bold">{selectedGift.price} €</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Prénom du destinataire</label>
                    <input 
                      required
                      type="text" 
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      placeholder="Ex: Sophie" 
                      className="w-full p-4 bg-muted border border-transparent focus:border-primary rounded-xl outline-none transition-all text-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Titre de la cagnotte (Optionnel)</label>
                    <input 
                      type="text" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ex: Les 30 ans de Sophie 🎂" 
                      className="w-full p-4 bg-muted border border-transparent focus:border-primary rounded-xl outline-none transition-all text-lg"
                    />
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Date de fin de la cagnotte</label>
                    <div className="relative">
                      <Calendar className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input 
                        required
                        type="date" 
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-muted border border-transparent focus:border-primary rounded-xl outline-none transition-all text-lg"
                      />
                    </div>
                  </div>
                  
                  <div className="bg-primary/10 p-4 rounded-xl text-sm text-primary flex gap-3 items-start">
                    <span className="text-xl">💡</span>
                    <p>
                      Une fois l'objectif atteint, {recipient || "le destinataire"} recevra le cadeau. S'il ne lui plaît pas, il pourra toujours l'échanger !
                    </p>
                  </div>
                </>
              )}

              <button 
                type="submit" 
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 rounded-xl font-bold hover:bg-primary/90 transition-all text-lg mt-8"
              >
                {step === 1 ? "Continuer" : "Créer la cagnotte"}
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CreateGroupGift() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement...</div>}>
      <CreateGroupGiftContent />
    </Suspense>
  );
}
