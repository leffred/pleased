import Link from "next/link";
import { Gift, Link as LinkIcon, Truck, ArrowRight, Heart } from "lucide-react";
import { Footer } from "@/components/layout/Footer";

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            <span className="font-bold text-lg tracking-tight">Pleased</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/gifts" className="text-sm font-medium hover:text-primary transition-colors">
              Catalogue
            </Link>
            <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
              Connexion
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 md:py-24 max-w-5xl">
        <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-6 text-primary">
            <Heart className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Offrez le sourire, <br className="hidden md:block"/>on s'occupe du reste.</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Pleased révolutionne l'art d'offrir. Plus besoin de demander discrètement l'adresse ou de gâcher la surprise.
          </p>
        </div>

        <div className="space-y-24 relative">
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-muted/50 -translate-x-1/2 hidden md:block" />

          {/* Etape 1 */}
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="w-full md:w-1/2 md:text-right">
              <h2 className="text-3xl font-bold mb-4">1. Vous choisissez le cadeau parfait</h2>
              <p className="text-lg text-muted-foreground">Parcourez notre sélection pointue de produits premium. De la tech à la gastronomie en passant par les expériences, trouvez ce qui lui fera plaisir.</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-background border-4 border-primary flex items-center justify-center text-primary font-bold text-xl flex-shrink-0 relative z-10 shadow-xl">
              1
            </div>
            <div className="w-full md:w-1/2 bg-card border rounded-3xl p-8 shadow-lg">
              <Gift className="w-12 h-12 text-primary mb-4" />
              <div className="h-4 w-3/4 bg-muted rounded mb-2" />
              <div className="h-4 w-1/2 bg-muted rounded" />
            </div>
          </div>

          {/* Etape 2 */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-16 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl font-bold mb-4">2. Vous obtenez un lien magique</h2>
              <p className="text-lg text-muted-foreground">Réglez votre commande de manière sécurisée et recevez instantanément un lien d'Unwrapping. Envoyez ce lien par SMS, WhatsApp, ou email à votre destinataire.</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-background border-4 border-primary flex items-center justify-center text-primary font-bold text-xl flex-shrink-0 relative z-10 shadow-xl">
              2
            </div>
            <div className="w-full md:w-1/2 bg-card border rounded-3xl p-8 shadow-lg text-right">
              <LinkIcon className="w-12 h-12 text-blue-500 mb-4 ml-auto" />
              <div className="h-4 w-full bg-blue-100 rounded mb-2" />
              <div className="h-4 w-3/4 bg-blue-100 rounded ml-auto" />
            </div>
          </div>

          {/* Etape 3 */}
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <div className="w-full md:w-1/2 md:text-right">
              <h2 className="text-3xl font-bold mb-4">3. Ils vivent l'expérience</h2>
              <p className="text-lg text-muted-foreground">En cliquant sur le lien, le destinataire découvre une magnifique animation pour ouvrir son cadeau, lit votre mot personnel, et renseigne son adresse postale en toute confidentialité.</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-background border-4 border-primary flex items-center justify-center text-primary font-bold text-xl flex-shrink-0 relative z-10 shadow-xl">
              3
            </div>
            <div className="w-full md:w-1/2 bg-card border rounded-3xl p-8 shadow-lg">
              <Truck className="w-12 h-12 text-green-500 mb-4" />
              <div className="h-10 w-full bg-muted rounded-xl mb-4" />
              <div className="h-12 w-full bg-primary/20 rounded-xl" />
            </div>
          </div>
        </div>

        <div className="mt-32 text-center">
          <h2 className="text-3xl font-bold mb-8">Prêt à faire plaisir ?</h2>
          <Link href="/gifts" className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-bold hover:bg-primary/90 transition-transform hover:scale-105 shadow-xl">
            Voir les cadeaux
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
