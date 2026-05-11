import Link from "next/link";
import { Gift, ArrowLeft, Check, Truck, Shield } from "lucide-react";

// Fake product data
const product = {
  id: "1", 
  name: "Coffret Dégustation Truffes", 
  price: 65, 
  category: "Food", 
  description: "Un assortiment exceptionnel des meilleures truffes au chocolat noir, lait et blanc, fabriquées artisanalement. Le cadeau parfait pour les gourmands exigeants.",
  image: "https://images.unsplash.com/photo-1605335035252-4fc88656d0d2?w=1200&q=80",
  features: [
    "Fabrication artisanale française",
    "Ingrédients 100% naturels",
    "Boîte cadeau premium incluse"
  ]
};

export default function ProductDetail({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-background sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Link href="/gifts" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mr-6">
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline font-medium">Retour</span>
          </Link>
          <div className="h-6 w-px bg-border mx-4 hidden sm:block"></div>
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            <span className="font-bold text-lg tracking-tight">Pleased</span>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-24 max-w-6xl mx-auto">
          {/* Image */}
          <div className="rounded-3xl overflow-hidden bg-muted aspect-square relative border">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center">
            <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold tracking-wider uppercase mb-6 w-fit">
              {product.category}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{product.name}</h1>
            <div className="text-3xl font-bold mb-8">{product.price} €</div>
            
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              {product.description}
            </p>

            <ul className="space-y-3 mb-10">
              {product.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3 text-muted-foreground">
                  <div className="bg-primary/10 p-1 rounded-full text-primary">
                    <Check className="w-4 h-4" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            <div className="grid grid-cols-2 gap-4 mb-10 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 bg-muted p-4 rounded-xl">
                <Truck className="w-5 h-5 text-foreground" />
                <span>Livraison offerte</span>
              </div>
              <div className="flex items-center gap-2 bg-muted p-4 rounded-xl">
                <Shield className="w-5 h-5 text-foreground" />
                <span>Échange gratuit</span>
              </div>
            </div>

            <div className="mt-auto">
              <Link href="/checkout" className="block w-full bg-primary text-primary-foreground text-center py-4 rounded-2xl text-lg font-bold hover:bg-primary/90 transition-all hover:shadow-lg hover:-translate-y-1">
                Offrir ce cadeau
              </Link>
              <p className="text-center text-xs text-muted-foreground mt-4">
                Vous n'avez pas besoin de l'adresse du destinataire.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
