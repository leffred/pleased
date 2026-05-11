import Link from "next/link";
import { Gift, ArrowLeft, CreditCard, Lock } from "lucide-react";

export default function Checkout() {
  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
      <header className="border-b bg-background sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/gifts/1" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline font-medium">Retour au cadeau</span>
          </Link>
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            <span className="font-bold text-lg tracking-tight">Pleased</span>
          </div>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <div className="grid md:grid-cols-3 gap-8 items-start">
          
          {/* Form */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-card border rounded-3xl p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">1. Pour qui est-ce ?</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Prénom du destinataire</label>
                  <input type="text" placeholder="Ex: Thomas" className="w-full p-3 bg-muted border border-transparent focus:border-primary rounded-xl outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Votre message personnel</label>
                  <textarea rows={4} placeholder="Joyeux anniversaire ! Profite bien de ce cadeau..." className="w-full p-3 bg-muted border border-transparent focus:border-primary rounded-xl outline-none transition-all resize-none"></textarea>
                </div>
              </div>
            </div>

            <div className="bg-card border rounded-3xl p-6 md:p-8 shadow-sm opacity-50 pointer-events-none">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">2. Paiement</h2>
                <Lock className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-6">Vous serez redirigé vers notre partenaire sécurisé Stripe après validation.</p>
              <button className="w-full flex justify-center items-center gap-2 bg-foreground text-background py-4 rounded-xl font-medium">
                <CreditCard className="w-5 h-5" />
                Payer de manière sécurisée
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-card border rounded-3xl p-6 shadow-sm sticky top-24">
            <h3 className="font-bold text-lg mb-4">Récapitulatif</h3>
            <div className="flex gap-4 mb-6">
              <div className="w-20 h-20 bg-muted rounded-xl overflow-hidden shrink-0">
                <img src="https://images.unsplash.com/photo-1605335035252-4fc88656d0d2?w=400&q=80" alt="Cadeau" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-medium text-sm line-clamp-2 mb-1">Coffret Dégustation Truffes</h4>
                <div className="text-primary font-bold">65 €</div>
              </div>
            </div>
            
            <div className="space-y-3 text-sm border-t pt-4 mb-6">
              <div className="flex justify-between text-muted-foreground">
                <span>Sous-total</span>
                <span>65,00 €</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Frais de service Pleased</span>
                <span>3,50 €</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>68,50 €</span>
              </div>
            </div>

            <button className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold hover:bg-primary/90 transition-all">
              Valider & Payer
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
