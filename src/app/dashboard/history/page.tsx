"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Package, Truck, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";

export default function DashboardHistory() {
  const [gifts, setGifts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dans un cas réel, filtrer par user_id
    supabase.from('gifts')
      .select('*, products(*)')
      .in('status', ['paid_waiting_address', 'shipped', 'delivered', 'swapped'])
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setGifts(data || []);
        setLoading(false);
      });
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid_waiting_address': return <Clock className="w-4 h-4 text-amber-500" />;
      case 'shipped': return <Truck className="w-4 h-4 text-blue-500" />;
      case 'delivered': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      default: return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid_waiting_address': return 'Payé (En attente d\'adresse)';
      case 'shipped': return 'Expédié';
      case 'delivered': return 'Livré';
      default: return status;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Historique des envois</h1>
        <p className="text-muted-foreground">Retrouvez tous les cadeaux que vous avez offerts et leur statut de livraison.</p>
      </div>

      {loading ? (
        <div className="text-center text-muted-foreground py-12">Chargement de votre historique...</div>
      ) : gifts.length === 0 ? (
        <div className="text-center bg-card border rounded-3xl p-12 shadow-sm">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-bold mb-2">Aucun cadeau envoyé</h3>
          <p className="text-muted-foreground mb-6">Vous n'avez pas encore finalisé de cadeaux.</p>
          <Link href="/gifts" className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors">
            Découvrir le catalogue
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {gifts.map((gift) => (
            <div key={gift.id} className="bg-card border rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-20 h-20 bg-muted rounded-xl flex-shrink-0 overflow-hidden border">
                {gift.products?.image_url && (
                  <img src={gift.products.image_url} alt={gift.products.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-grow text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-sm font-medium mb-2">
                  {getStatusIcon(gift.status)}
                  {getStatusText(gift.status)}
                </div>
                <h3 className="font-bold text-lg">{gift.products?.name || "Cadeau personnalisé"}</h3>
                <p className="text-muted-foreground text-sm">
                  Commandé le {new Date(gift.created_at).toLocaleDateString('fr-FR')} • {gift.products?.price} €
                </p>
              </div>
              <div className="text-right w-full md:w-auto">
                <p className="text-sm text-muted-foreground mb-1">Destinataire</p>
                <p className="font-medium">{gift.recipient_name}</p>
                <p className="text-sm text-muted-foreground">{gift.recipient_phone}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
