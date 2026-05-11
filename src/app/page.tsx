import Link from "next/link";
import { Gift, ArrowRight, Zap, Globe, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar (Temporary, move to a component later) */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gift className="w-6 h-6 text-primary" />
            <span className="font-bold text-xl tracking-tight">Pleased</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/gifts" className="hover:text-primary transition-colors">Catalogue</Link>
            <Link href="#comment-ca-marche" className="hover:text-primary transition-colors">Comment ça marche ?</Link>
            <Link href="#entreprise" className="hover:text-primary transition-colors">Pour les entreprises</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">Connexion</Link>
            <Link href="/gifts" className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors">
              Envoyer un cadeau
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="py-20 md:py-32 overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background -z-10" />
          <div className="container mx-auto px-4 flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-6">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              La nouvelle façon d'offrir
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 max-w-4xl">
              Offrez sans demander l'adresse. <br className="hidden md:block" />
              <span className="text-primary">Aussi simple qu'un SMS.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl">
              Pleased vous permet d'envoyer un cadeau exceptionnel en quelques secondes. Le destinataire reçoit un lien magique, indique son adresse, et c'est expédié.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link href="/gifts" className="group bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-medium hover:bg-primary/90 transition-all flex items-center gap-2">
                Découvrir les cadeaux
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="#comment-ca-marche" className="bg-secondary text-secondary-foreground px-8 py-4 rounded-full text-lg font-medium hover:bg-secondary/80 transition-colors">
                Comment ça marche ?
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="comment-ca-marche" className="py-24 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">L'art d'offrir, réinventé.</h2>
              <p className="text-muted-foreground text-lg">Fini la corvée de demander l'adresse postale.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <Gift className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">1. Choisissez un cadeau</h3>
                <p className="text-muted-foreground">Parcourez notre catalogue sélectionné avec soin (gastronomie, tech, expériences) et personnalisez votre message.</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <Zap className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">2. Envoyez le lien</h3>
                <p className="text-muted-foreground">Réglez votre commande et recevez un lien magique. Envoyez-le par SMS, WhatsApp, ou Email au destinataire.</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">3. Ils le reçoivent</h3>
                <p className="text-muted-foreground">Le destinataire ouvre le lien, vit une expérience "Unwrapping" digitale, et saisit son adresse pour l'expédition.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

        <Footer />
    </div>
  );
}
