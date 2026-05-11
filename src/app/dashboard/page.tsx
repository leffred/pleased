import Link from "next/link";
import { PackageOpen, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default async function DashboardHome() {
  // Fetch real data from Supabase (fetching all for MVP demo purposes since auth is mocked)
  const { data: giftsData } = await supabase.from('gifts').select('*, product:products(*)');
  const { data: receivedData } = await supabase.from('gifts').select('*, product:products(*)').neq('status', 'pending_payment').limit(1);

  const sentGifts = giftsData?.map(g => ({
    id: g.id,
    recipient: g.recipient_name,
    item: g.product?.name || "Cadeau inconnu",
    status: g.status === 'delivered' || g.status === 'swapped' ? 'accepted' : 'sent',
    date: new Date(g.created_at).toLocaleDateString('fr-FR'),
    magicLink: `https://pleased.fr/receive/${g.magic_link_token}`
  })) || [];

  const receivedGifts = receivedData?.map(g => ({
    id: g.id,
    sender: "Secret",
    item: g.product?.name || "Cadeau inconnu",
    status: "shipped",
    date: new Date(g.created_at).toLocaleDateString('fr-FR')
  })) || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold mb-2">Bonjour, Thomas 👋</h1>
        <p className="text-muted-foreground">Voici l'état de vos cadeaux en cours.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-card p-6 border rounded-2xl shadow-sm">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4">
            <PackageOpen className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold mb-1">{sentGifts.length}</h3>
          <p className="text-sm text-muted-foreground font-medium">Cadeaux envoyés</p>
        </div>
        <div className="bg-card p-6 border rounded-2xl shadow-sm">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold mb-1">1</h3>
          <p className="text-sm text-muted-foreground font-medium">Cadeaux ouverts</p>
        </div>
        <div className="bg-card p-6 border rounded-2xl shadow-sm flex flex-col justify-center items-center text-center">
          <p className="text-sm font-medium mb-4">Envie de faire plaisir ?</p>
          <Link href="/gifts" className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium hover:bg-primary/90 transition-all flex items-center gap-2">
            Nouveau cadeau <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Cadeaux envoyés */}
        <div className="bg-card border rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Cadeaux envoyés</h2>
          <div className="space-y-4">
            {sentGifts.map((gift) => (
              <div key={gift.id} className="flex items-center justify-between p-4 rounded-xl border bg-muted/20">
                <div>
                  <h4 className="font-bold">{gift.recipient}</h4>
                  <p className="text-sm text-muted-foreground">{gift.item}</p>
                  <p className="text-xs text-muted-foreground mt-1">{gift.date}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {gift.status === "accepted" ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Ouvert
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                      <Clock className="w-3.5 h-3.5" /> En attente
                    </span>
                  )}
                  {gift.status === "sent" && (
                    <button className="text-xs text-primary font-medium hover:underline">
                      Copier le lien
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cadeaux reçus */}
        <div className="bg-card border rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Cadeaux reçus</h2>
          <div className="space-y-4">
            {receivedGifts.map((gift) => (
              <div key={gift.id} className="flex items-center justify-between p-4 rounded-xl border bg-muted/20">
                <div>
                  <h4 className="font-bold">De : {gift.sender}</h4>
                  <p className="text-sm text-muted-foreground">{gift.item}</p>
                  <p className="text-xs text-muted-foreground mt-1">{gift.date}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    Expédié
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
