import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function CheckoutSuccess({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  return (
    <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-3xl p-8 shadow-xl border text-center animate-in zoom-in fade-in duration-500">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Paiement validé !</h1>
        
        <p className="text-muted-foreground mb-8 text-lg">
          Merci pour votre achat. Le cadeau est maintenant prêt à être envoyé à son destinataire.
        </p>

        <div className="bg-primary/10 p-4 rounded-xl text-sm text-primary flex gap-3 items-start text-left mb-8">
          <span className="text-xl">💡</span>
          <p>
            Vous recevrez le lien magique à transmettre au destinataire par email d'ici quelques minutes. Vous pourrez également le retrouver dans votre tableau de bord.
          </p>
        </div>

        <Link href="/dashboard" className="w-full flex items-center justify-center gap-2 bg-foreground text-background py-4 rounded-xl font-bold hover:bg-foreground/90 transition-all text-lg">
          Aller au Tableau de Bord
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
