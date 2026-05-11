"use client";

import { useState } from "react";
import Link from "next/link";
import { Gift, ChevronDown, MessageCircleQuestion } from "lucide-react";
import { Footer } from "@/components/layout/Footer";

const faqs = [
  {
    question: "Comment ça fonctionne pour le destinataire ?",
    answer: "Le destinataire reçoit un lien unique (par SMS ou email). En cliquant, il découvre une animation dévoilant le cadeau, lit votre message personnel, et peut ensuite renseigner son adresse postale pour l'expédition. C'est magique et sécurisé."
  },
  {
    question: "Que se passe-t-il si le destinataire ne renseigne pas son adresse ?",
    answer: "Nous lui envoyons des rappels automatiques. Si au bout de 14 jours l'adresse n'est toujours pas renseignée, la commande est annulée et vous êtes intégralement remboursé."
  },
  {
    question: "Est-ce que je peux créer une cagnotte à plusieurs ?",
    answer: "Oui ! Sur la page d'un cadeau, choisissez l'option \"Créer une cagnotte\". Vous obtiendrez un lien à partager avec vos amis pour qu'ils participent financièrement."
  },
  {
    question: "Les paiements sont-ils sécurisés ?",
    answer: "Absolument. Tous nos paiements sont traités par Stripe, le leader mondial des paiements en ligne. Nous ne stockons aucune coordonnée bancaire sur nos serveurs."
  },
  {
    question: "Quels sont les délais de livraison ?",
    answer: "Une fois que le destinataire a validé son adresse, le cadeau est expédié sous 24h à 48h. La livraison standard prend généralement entre 2 et 4 jours ouvrés en France métropolitaine."
  },
  {
    question: "Puis-je annuler une commande ?",
    answer: "Vous pouvez annuler votre commande depuis votre tableau de bord tant que le destinataire n'a pas renseigné son adresse et que la commande n'a pas été expédiée."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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
            <Link href="/how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
              Comment ça marche
            </Link>
            <Link href="/gifts" className="text-sm font-medium hover:text-primary transition-colors">
              Catalogue
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 md:py-24 max-w-3xl">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-6 text-primary">
            <MessageCircleQuestion className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Foire Aux Questions</h1>
          <p className="text-xl text-muted-foreground">
            Tout ce que vous devez savoir sur Pleased.
          </p>
        </div>

        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`border rounded-2xl overflow-hidden transition-all duration-300 ${openIndex === index ? 'bg-card shadow-md border-primary/50' : 'bg-background hover:bg-muted/50'}`}
            >
              <button
                className="w-full px-6 py-5 flex items-center justify-between font-medium text-left"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="text-lg pr-8">{faq.question}</span>
                <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-300 flex-shrink-0 ${openIndex === index ? 'rotate-180 text-primary' : ''}`} />
              </button>
              
              <div 
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <p className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center bg-muted/30 border rounded-3xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
          <h3 className="text-xl font-bold mb-2">Vous avez une autre question ?</h3>
          <p className="text-muted-foreground mb-6">Notre équipe est là pour vous aider.</p>
          <a href="mailto:contact@pleased.fr" className="inline-flex bg-foreground text-background px-6 py-3 rounded-xl font-medium hover:bg-foreground/90 transition-colors">
            Contactez-nous
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
