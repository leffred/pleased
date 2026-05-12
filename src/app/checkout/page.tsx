"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Gift, ArrowLeft, CreditCard, Lock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { createCheckoutSession } from "@/app/actions/stripe";
import { payWithWorkspaceBalance } from "@/app/actions/workspace";
import { createPendingGift } from "@/app/actions/gift";
import { Briefcase } from "lucide-react";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId") || "1"; // Fallback for MVP testing
  const router = useRouter();

  const [product, setProduct] = useState<any>(null);
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>("");

  useEffect(() => {
    // Fetch product
    supabase.from('products').select('*').eq('id', productId).single().then(({ data }) => {
      if (data) setProduct(data);
    });

    // Fetch workspaces the user is member of
    supabase.from('workspace_members').select('workspace_id').then(({ data: memberData }) => {
      if (memberData && memberData.length > 0) {
        const workspaceIds = memberData.map(m => m.workspace_id);
        supabase.from('workspaces').select('*').in('id', workspaceIds).then(({ data: wsData }) => {
          setWorkspaces(wsData || []);
        });
      }
    });
  }, [productId]);

  const handleCheckout = async () => {
    if (!product || !recipient) return;
    setLoading(true);
    
    // Get current user id
    const { data: { session } } = await supabase.auth.getSession();
    const senderId = session?.user?.id;

    // Insert gift as pending_payment via Server Action to bypass RLS select issues
    const { success, gift, error } = await createPendingGift(product.id, recipient, message, senderId || null);

    if (success && gift) {
      if (selectedWorkspace) {
        // Pay with workspace balance
        const totalCents = Math.round((product.price + 3.50) * 100);
        const { success, error: wsError } = await payWithWorkspaceBalance(gift.id, selectedWorkspace, totalCents);
        if (success) {
          router.push(`/checkout/success?session_id=workspace_${gift.id}`);
        } else {
          console.error("Workspace payment error:", wsError);
          setLoading(false);
          alert(wsError || "Erreur lors du paiement via le portefeuille.");
        }
      } else {
        // Call Stripe Server Action
        const { url, error: stripeError } = await createCheckoutSession(
          gift.id, 
          product.price, 
          product.name, 
          product.image_url
        );

        if (url) {
          router.push(url);
        } else {
          console.error("Stripe Checkout Error:", stripeError);
          setLoading(false);
          alert("Une erreur est survenue lors de l'initialisation du paiement.");
        }
      }
    } else {
      console.error("Supabase Insert Error:", error);
      setLoading(false);
      alert("Erreur lors de la création de la commande.");
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
      <header className="border-b bg-background sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href={`/gifts/${productId}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline font-medium">Retour au cadeau</span>
          </Link>
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            <span className="font-bold text-lg tracking-tight">Pleased</span>
          </div>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <div className="grid md:grid-cols-3 gap-8 items-start">
          
          <div className="md:col-span-2 space-y-8">
            <div className="bg-card border rounded-3xl p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">1. Pour qui est-ce ?</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Prénom du destinataire</label>
                  <input 
                    required
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    type="text" 
                    placeholder="Ex: Thomas" 
                    className="w-full p-3 bg-muted border border-transparent focus:border-primary rounded-xl outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Votre message personnel</label>
                  <textarea 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4} 
                    placeholder="Joyeux anniversaire ! Profite bien de ce cadeau..." 
                    className="w-full p-3 bg-muted border border-transparent focus:border-primary rounded-xl outline-none transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            <div className={`bg-card border rounded-3xl p-6 md:p-8 shadow-sm transition-all ${!recipient ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">2. Paiement</h2>
                <Lock className="w-5 h-5 text-muted-foreground" />
              </div>
              
              {workspaces.length > 0 && (
                <div className="mb-6 space-y-3">
                  <label className="block text-sm font-medium mb-2">Moyen de paiement</label>
                  
                  <div 
                    onClick={() => setSelectedWorkspace("")}
                    className={`p-4 border rounded-xl cursor-pointer flex items-center gap-3 transition-colors ${selectedWorkspace === "" ? "border-primary bg-primary/5" : "hover:border-primary/50"}`}
                  >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedWorkspace === "" ? "border-primary" : "border-muted-foreground"}`}>
                      {selectedWorkspace === "" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                    </div>
                    <CreditCard className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">Carte Bancaire (Stripe)</span>
                  </div>

                  {workspaces.map((ws) => {
                    const totalCents = Math.round(((product?.price || 0) + 3.50) * 100);
                    const hasEnoughFunds = ws.balance >= totalCents;
                    
                    return (
                      <div 
                        key={ws.id}
                        onClick={() => hasEnoughFunds && setSelectedWorkspace(ws.id)}
                        className={`p-4 border rounded-xl flex items-center justify-between transition-colors ${hasEnoughFunds ? 'cursor-pointer hover:border-primary/50' : 'opacity-60 cursor-not-allowed'} ${selectedWorkspace === ws.id ? "border-primary bg-primary/5" : ""}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedWorkspace === ws.id ? "border-primary" : "border-muted-foreground"}`}>
                            {selectedWorkspace === ws.id && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                          </div>
                          <Briefcase className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <span className="font-medium block">Solde : {ws.name}</span>
                            <span className="text-sm text-muted-foreground">{(ws.balance / 100).toFixed(2)} € disponibles</span>
                          </div>
                        </div>
                        {!hasEnoughFunds && (
                          <span className="text-xs font-medium text-destructive bg-destructive/10 px-2 py-1 rounded-full">Solde insuffisant</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {selectedWorkspace === "" && (
                <>
                  <p className="text-muted-foreground mb-6">Vous serez redirigé vers notre partenaire sécurisé Stripe après validation.</p>
                  <button className="w-full flex justify-center items-center gap-2 bg-foreground text-background py-4 rounded-xl font-medium pointer-events-none">
                    <CreditCard className="w-5 h-5" />
                    Paiement par CB sécurisé
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="bg-card border rounded-3xl p-6 shadow-sm sticky top-24">
            <h3 className="font-bold text-lg mb-4">Récapitulatif</h3>
            {product && (
              <div className="flex gap-4 mb-6">
                <div className="w-20 h-20 bg-muted rounded-xl overflow-hidden shrink-0">
                  <img src={product.image_url} alt="Cadeau" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-medium text-sm line-clamp-2 mb-1">{product.name}</h4>
                  <div className="text-primary font-bold">{product.price} €</div>
                </div>
              </div>
            )}
            
            <div className="space-y-3 text-sm border-t pt-4 mb-6">
              <div className="flex justify-between text-muted-foreground">
                <span>Sous-total</span>
                <span>{product?.price || 0} €</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Frais de service Pleased</span>
                <span>3,50 €</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>{(product?.price || 0) + 3.50} €</span>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={loading || !recipient}
              className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-70"
            >
              {loading ? "Traitement..." : "Valider & Payer"}
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}

export default function Checkout() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
