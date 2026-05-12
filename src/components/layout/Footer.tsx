import Link from "next/link";
import { Gift } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Gift className="w-6 h-6 text-primary" />
              <span className="font-bold text-xl tracking-tight">Pleased</span>
            </Link>
            <p className="text-muted-foreground mb-4 max-w-sm">
              La nouvelle façon d'offrir. Envoyez des cadeaux exceptionnels sans demander l'adresse, aussi simplement qu'un SMS.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li><Link href="/gifts" className="text-muted-foreground hover:text-primary transition-colors">Catalogue de cadeaux</Link></li>
              <li><Link href="/features" className="text-muted-foreground hover:text-primary transition-colors">Toutes nos fonctionnalités</Link></li>
              <li><Link href="/how-it-works" className="text-muted-foreground hover:text-primary transition-colors">Comment ça marche ?</Link></li>
              <li><Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors">Foire Aux Questions</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Légal</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Mentions légales</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">CGV</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Politique de confidentialité</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="text-center text-sm text-muted-foreground border-t pt-8">
          <p>© {new Date().getFullYear()} Pleased.fr - Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
