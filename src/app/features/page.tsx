import { Gift, Zap, Users, Briefcase, FileSpreadsheet, Bot, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-background sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Retour</span>
          </Link>
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            <span className="font-bold text-lg tracking-tight">Pleased</span>
          </div>
          <div className="w-20"></div>
        </div>
      </header>

      <main className="flex-grow py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Toutes nos fonctionnalités</h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Découvrez comment Pleased révolutionne l'art d'offrir pour les particuliers et les entreprises.
            </p>
          </div>

          <div className="max-w-5xl mx-auto space-y-24">
            {/* B2C Section */}
            <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
              <div className="mb-12 border-b pb-4">
                <h2 className="text-3xl font-bold">Pour les Particuliers (B2C)</h2>
                <p className="text-muted-foreground mt-2">Offrez facilement à vos amis ou votre famille.</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <FeatureCard 
                  icon={<Zap />}
                  title="Cadeau par lien magique"
                  description="Plus besoin de demander l'adresse. Payez le cadeau, recevez un lien magique, et envoyez-le par SMS ou WhatsApp."
                />
                <FeatureCard 
                  icon={<Gift />}
                  title="Expérience Unwrapping"
                  description="Le destinataire profite d'une animation premium de déballage digital (Digital Unwrapping) avant de découvrir son cadeau."
                />
                <FeatureCard 
                  icon={<ArrowRight />}
                  title="Possibilité d'échanger (Swap)"
                  description="Si le cadeau ne plaît pas, le destinataire peut l'échanger secrètement contre un autre cadeau de même valeur de notre catalogue."
                />
                <FeatureCard 
                  icon={<Users />}
                  title="Cadeaux Groupés"
                  description="Créez une cagnotte, invitez des amis à participer, et envoyez un superbe cadeau financé à plusieurs sans tracas."
                />
              </div>
            </section>

            {/* B2B Section */}
            <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
              <div className="mb-12 border-b pb-4">
                <h2 className="text-3xl font-bold">Pour les Entreprises (B2B)</h2>
                <p className="text-muted-foreground mt-2">Fidélisez vos clients et récompensez vos collaborateurs à grande échelle.</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <FeatureCard 
                  icon={<Briefcase />}
                  title="Espaces Entreprises (Workspaces)"
                  description="Créez un portefeuille prépayé (Wallet). Vos collaborateurs peuvent envoyer des cadeaux sur le compte de l'entreprise sans utiliser de carte bancaire."
                />
                <FeatureCard 
                  icon={<FileSpreadsheet />}
                  title="Envois en masse (CSV)"
                  description="Téléchargez un fichier CSV (Nom, Email, Message) et envoyez des dizaines de cadeaux d'un seul clic grâce à votre solde."
                />
                <FeatureCard 
                  icon={<Bot />}
                  title="Automatisations RH via API"
                  description="Connectez vos outils RH (n8n, Make, Zapier) à notre API pour déclencher l'envoi de cadeaux automatiques (Anniversaires, Onboarding)."
                />
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-card border p-8 rounded-3xl hover:border-primary/50 transition-all duration-300 group">
      <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  )
}
