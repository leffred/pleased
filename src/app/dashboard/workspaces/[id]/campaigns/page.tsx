"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, UploadCloud, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { createMassGifts } from "@/app/actions/workspace";

export default function MassGiftingCampaign() {
  const params = useParams();
  const workspaceId = params.id as string;
  const router = useRouter();

  const [workspace, setWorkspace] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  const [parsedRows, setParsedRows] = useState<{recipientName: string, recipientEmail: string, message: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Fetch Workspace
    supabase.from('workspaces').select('*').eq('id', workspaceId).single().then(({ data }) => {
      setWorkspace(data);
    });

    // Fetch Products
    supabase.from('products').select('id, name, price, image_url').limit(50).then(({ data }) => {
      setProducts(data || []);
      if (data && data.length > 0) setSelectedProduct(data[0]);
    });
  }, [workspaceId]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const rows = text.split('\n').map(row => row.trim()).filter(row => row.length > 0);
      
      // Assume CSV format: Nom, Email, Message
      const parsed = rows.slice(1).map(row => { // skip header
        // Simple CSV parse handling quotes roughly
        const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.replace(/^"|"$/g, '').trim());
        return {
          recipientName: cols[0] || "Inconnu",
          recipientEmail: cols[1] || "",
          message: cols[2] || ""
        };
      });

      setParsedRows(parsed.filter(r => r.recipientEmail)); // Need email at least
      setError(null);
    };
    reader.readAsText(file);
  };

  const handleCreateCampaign = async () => {
    if (!selectedProduct || parsedRows.length === 0) return;
    
    setLoading(true);
    setError(null);
    
    const totalCostCents = Math.round((selectedProduct.price + 3.50) * parsedRows.length * 100);
    
    const res = await createMassGifts(workspaceId, selectedProduct.id, parsedRows, totalCostCents);
    
    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push(`/dashboard/workspaces/${workspaceId}`);
      }, 3000);
    } else {
      setError(res.error || "Une erreur est survenue.");
      setLoading(false);
    }
  };

  const totalCost = selectedProduct ? (selectedProduct.price + 3.50) * parsedRows.length : 0;
  const hasEnoughBalance = workspace ? workspace.balance >= totalCost * 100 : false;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link href={`/dashboard/workspaces/${workspaceId}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Retour à l'espace
      </Link>

      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Nouvelle Campagne B2B</h1>
        <p className="text-muted-foreground">Envoyez des dizaines de cadeaux d'un seul coup grâce à un fichier CSV.</p>
      </div>

      {success ? (
        <div className="bg-green-50 text-green-700 p-8 rounded-3xl border border-green-200 text-center flex flex-col items-center">
          <CheckCircle2 className="w-16 h-16 mb-4 text-green-500" />
          <h2 className="text-2xl font-bold mb-2">Campagne créée avec succès !</h2>
          <p className="text-green-600/80">Les cadeaux ont été générés. Vos automatisations vont maintenant s'en occuper.</p>
          <p className="text-sm mt-4 text-green-600/60">Redirection vers l'espace en cours...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-card border rounded-3xl p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-bold mb-4">1. Choisissez le produit par défaut</h2>
              <select 
                className="w-full p-4 rounded-xl border bg-muted/50 focus:border-primary outline-none"
                value={selectedProduct?.id || ""}
                onChange={(e) => setSelectedProduct(products.find(p => p.id === e.target.value))}
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} - {p.price} €</option>
                ))}
              </select>
            </div>

            <div className="bg-card border rounded-3xl p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-bold mb-4">2. Importez votre liste CSV</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Le fichier doit contenir 3 colonnes : <strong>Nom, Email, Message</strong>. <br/>(La première ligne sera ignorée en tant qu'en-tête).
              </p>
              
              <label className="border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-colors rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer bg-muted/20">
                <UploadCloud className="w-10 h-10 text-muted-foreground mb-4" />
                <span className="font-medium">Cliquez pour uploader un .csv</span>
                <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
              </label>

              {parsedRows.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    {parsedRows.length} destinataires détectés
                  </h3>
                  <div className="max-h-60 overflow-y-auto border rounded-xl divide-y">
                    {parsedRows.slice(0, 50).map((row, i) => (
                      <div key={i} className="p-3 text-sm flex justify-between hover:bg-muted/50">
                        <span className="font-medium">{row.recipientName}</span>
                        <span className="text-muted-foreground truncate w-1/3 text-right">{row.recipientEmail}</span>
                      </div>
                    ))}
                    {parsedRows.length > 50 && (
                      <div className="p-3 text-sm text-center text-muted-foreground bg-muted/20">
                        + {parsedRows.length - 50} autres lignes...
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-card border rounded-3xl p-6 shadow-sm sticky top-8">
              <h3 className="font-bold text-lg mb-4">Récapitulatif</h3>
              
              {selectedProduct && parsedRows.length > 0 ? (
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Produits ({parsedRows.length}x)</span>
                    <span>{(selectedProduct.price * parsedRows.length).toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Frais de service</span>
                    <span>{(3.50 * parsedRows.length).toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-4 border-t">
                    <span>Total Campagne</span>
                    <span>{totalCost.toFixed(2)} €</span>
                  </div>
                  
                  {workspace && (
                    <div className={`p-4 rounded-xl text-sm ${hasEnoughBalance ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
                      <div className="flex justify-between mb-1">
                        <span>Solde actuel :</span>
                        <span className="font-bold">{(workspace.balance / 100).toFixed(2)} €</span>
                      </div>
                      {!hasEnoughBalance && (
                        <div className="flex items-center gap-1 mt-2 text-xs">
                          <AlertCircle className="w-3 h-3" />
                          Solde insuffisant pour cette campagne.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground mb-6">Importez une liste pour voir le coût estimé.</p>
              )}

              {error && <div className="text-sm text-destructive mb-4 p-3 bg-destructive/10 rounded-lg">{error}</div>}

              <button 
                onClick={handleCreateCampaign}
                disabled={loading || parsedRows.length === 0 || !hasEnoughBalance}
                className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50"
              >
                {loading ? "Génération en cours..." : "Lancer la campagne"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
