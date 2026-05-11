"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Wallet, TrendingUp, History, Plus } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createTopUpCheckoutSession } from "@/app/actions/stripe";

export default function WorkspaceDetail() {
  const params = useParams();
  const workspaceId = params.id as string;
  
  const [workspace, setWorkspace] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [recharging, setRecharging] = useState(false);

  useEffect(() => {
    if (!workspaceId) return;

    const fetchData = async () => {
      setLoading(true);
      // Fetch Workspace
      const { data: ws } = await supabase
        .from('workspaces')
        .select('*')
        .eq('id', workspaceId)
        .single();
      
      setWorkspace(ws);

      // Fetch Transactions
      const { data: txs } = await supabase
        .from('transactions')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false });

      setTransactions(txs || []);
      setLoading(false);
    };

    fetchData();
  }, [workspaceId]);

  const handleTopUp = async () => {
    setRecharging(true);
    try {
      const res = await createTopUpCheckoutSession(workspaceId, 50000); // 500€
      
      if (res.url) {
        window.location.href = res.url;
      } else {
        alert(res.error || "Erreur de paiement");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'initialisation du rechargement.");
    } finally {
      setRecharging(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">Chargement de l'espace...</div>;
  }

  if (!workspace) {
    return <div className="text-center py-12">Espace introuvable ou accès refusé.</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link href="/dashboard/workspaces" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Retour aux espaces
      </Link>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">{workspace.name}</h1>
          <p className="text-muted-foreground">Gérez le solde et l'historique de votre entreprise.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Wallet Card */}
        <div className="md:col-span-1 bg-primary text-primary-foreground rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6 text-primary-foreground/80 font-medium">
              <Wallet className="w-5 h-5" />
              Solde disponible
            </div>
            <div className="text-4xl font-bold mb-8">
              {(workspace.balance / 100).toFixed(2)} €
            </div>
            <button 
              onClick={handleTopUp}
              disabled={recharging}
              className="w-full bg-white text-primary px-4 py-3 rounded-xl font-bold hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              {recharging ? "Redirection..." : "Recharger 500 €"}
            </button>
          </div>
        </div>

        {/* Transactions list */}
        <div className="md:col-span-2 bg-card border rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <History className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">Historique des transactions</h2>
          </div>

          {transactions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Aucune transaction pour le moment. Rechargez votre solde pour commencer à offrir des cadeaux.
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 rounded-2xl bg-muted/50">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'deposit' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                      {tx.type === 'deposit' ? <TrendingUp className="w-5 h-5" /> : <Wallet className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-medium">{tx.description || (tx.type === 'deposit' ? 'Rechargement' : 'Achat de cadeau')}</p>
                      <p className="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleDateString('fr-FR')} à {new Date(tx.created_at).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                  </div>
                  <div className={`font-bold ${tx.type === 'deposit' ? 'text-green-600' : ''}`}>
                    {tx.type === 'deposit' ? '+' : ''}{(tx.amount / 100).toFixed(2)} €
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
