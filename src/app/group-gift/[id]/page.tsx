"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Gift, CreditCard, Heart, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { createPoolContributionSession } from "@/app/actions/stripe";
import { useRouter, useSearchParams } from "next/navigation";

export default function ParticipateGroupGift({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get("success") === "true";

  const [pool, setPool] = useState<any>(null);
  const [contributions, setContributions] = useState<any[]>([]);
  const [amount, setAmount] = useState<number | "">("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch pool details
    supabase.from('pools').select('*').eq('id', params.id).single().then(({ data }) => {
      if (data) setPool(data);
    });

    // Fetch contributions
    supabase.from('pool_contributions').select('*').eq('pool_id', params.id).order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setContributions(data);
    });
  }, [params.id]);

  const totalAmount = contributions.reduce((sum, c) => sum + (Number(c.amount) || 0), 0);

  const handlePayment = async () => {
    if (!amount || !name || !pool) return;
    setLoading(true);

    const { url, error } = await createPoolContributionSession(
      pool.id,
      Number(amount),
      pool.title || "Cagnotte",
      name,
      message
    );

    if (url) {
      router.push(url);
    } else {
      console.error(error);
      alert("Erreur lors de l'initialisation du paiement.");
      setLoading(false);
    }
  };

  if (!pool) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-card rounded-3xl p-8 shadow-xl border text-center animate-in zoom-in fade-in duration-500">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Merci {name || "pour votre participation"} !</h1>
          <p className="text-muted-foreground mb-8 text-lg">
            Votre paiement a été validé. Votre mot a été ajouté à la cagnotte.
          </p>
          <Link href={`/group-gift/${params.id}`} className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 rounded-xl font-bold hover:bg-primary/90 transition-all text-lg">
            Retour à la cagnotte
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 pb-12">
      <header className="bg-background border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            <span className="font-bold text-lg tracking-tight">Pleased</span>
          </Link>
          <div className="text-sm font-medium bg-muted px-3 py-1 rounded-full">
            Cagnotte sécurisée
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          {/* Info Section */}
          <div className="space-y-8">
            <div>
              <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold tracking-wider uppercase mb-4">
                Cadeau de groupe
              </div>
              <h1 className="text-4xl font-bold mb-4">{pool.title || `Cagnotte pour ${pool.recipient_name}`}</h1>
              <p className="text-muted-foreground text-lg mb-6">
                Organisé pour <span className="font-medium text-foreground">{pool.recipient_name}</span>.
              </p>

              <div className="bg-card border rounded-2xl p-6 shadow-sm mb-8">
                <div className="text-3xl font-bold text-primary mb-1">{totalAmount} € <span className="text-sm font-normal text-muted-foreground">récoltés</span></div>
                <div className="text-sm font-medium mb-4">{contributions.length} participants</div>
                
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-primary" style={{ width: `${Math.min(100, (totalAmount / 100) * 100)}%` }}></div>
                </div>
                <p className="text-xs text-muted-foreground text-right">Se termine le {new Date(pool.end_date).toLocaleDateString('fr-FR')}</p>
              </div>

              <h3 className="font-bold text-xl mb-4">Mots des participants</h3>
              {contributions.length === 0 ? (
                <p className="text-muted-foreground italic">Soyez le premier à participer !</p>
              ) : (
                <div className="space-y-4">
                  {contributions.map((msg, i) => (
                    <div key={i} className="bg-card p-4 rounded-xl border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold">{msg.participant_name}</span>
                        <span className="text-sm bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{msg.amount} €</span>
                      </div>
                      {msg.message && <p className="text-muted-foreground italic text-sm">"{msg.message}"</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-card border rounded-3xl p-6 md:p-8 shadow-xl sticky top-24">
            {step === 1 ? (
              <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-6">
                <h2 className="text-2xl font-bold mb-6">Participer</h2>
                
                <div>
                  <label className="block text-sm font-medium mb-3">Montant de votre participation</label>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[20, 50, 100].map((val) => (
                      <button 
                        type="button"
                        key={val}
                        onClick={() => setAmount(val)}
                        className={`py-3 rounded-xl font-bold border transition-all ${amount === val ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted/50 hover:bg-muted border-transparent'}`}
                      >
                        {val} €
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <input 
                      type="number" 
                      required
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value) || "")}
                      placeholder="Autre montant" 
                      className="w-full p-4 bg-muted border border-transparent focus:border-primary rounded-xl outline-none transition-all text-lg pl-8"
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">€</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Votre nom</label>
                  <input 
                    required
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={`Pour que ${pool.recipient_name} vous reconnaisse`} 
                    className="w-full p-3 bg-muted border border-transparent focus:border-primary rounded-xl outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Un petit mot doux (Optionnel)</label>
                  <textarea 
                    rows={3} 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Joyeux anniversaire !" 
                    className="w-full p-3 bg-muted border border-transparent focus:border-primary rounded-xl outline-none transition-all resize-none"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={!amount || !name}
                  className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold hover:bg-primary/90 transition-all text-lg disabled:opacity-50"
                >
                  Continuer
                </button>
              </form>
            ) : (
              <div className="animate-in slide-in-from-right-4 duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Paiement</h2>
                  <button onClick={() => setStep(1)} className="text-sm font-medium text-primary hover:underline">Modifier</button>
                </div>
                
                <div className="bg-muted p-4 rounded-xl flex items-center justify-between mb-8">
                  <span className="font-medium">Total à payer</span>
                  <span className="text-2xl font-bold">{amount} €</span>
                </div>

                <p className="text-muted-foreground mb-6 text-sm">
                  Pleased sécurise votre paiement via Stripe. Aucuns frais supplémentaires ne vous sont facturés.
                </p>

                <button 
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full flex justify-center items-center gap-2 bg-foreground text-background py-4 rounded-xl font-bold hover:bg-foreground/90 transition-all text-lg disabled:opacity-70"
                >
                  {loading ? "Redirection..." : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Payer {amount} €
                    </>
                  )}
                </button>

                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Heart className="w-4 h-4 text-accent" />
                  Merci pour votre participation !
                </div>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
