"use client";

import { useState } from "react";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export function AIGiftAssistant() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    age: "",
    gender: "Peu importe",
    interests: "",
    budget: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.interests) return;
    
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-gift-assistant', {
        body: formData
      });

      if (error) throw new Error("Erreur de l'Edge Function");
      
      if (data.productIds && data.productIds.length > 0) {
        // Rediriger avec les IDs en searchParams
        router.push(`/gifts?ids=${data.productIds.join(",")}`);
      } else {
        alert("Nous n'avons pas pu trouver de recommandation exacte. Essayez d'autres mots-clés.");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur de connexion à l'assistant IA.");
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return (
      <div className="mb-12">
        <button 
          onClick={() => setIsOpen(true)}
          className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[1px] rounded-3xl hover:scale-[1.01] transition-transform duration-300 shadow-xl"
        >
          <div className="bg-card w-full h-full rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-100 to-pink-100 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-8 h-8 text-indigo-500" />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-pink-500 mb-1">
                  Je ne sais pas quoi offrir...
                </h2>
                <p className="text-muted-foreground">Laissez notre IA trouver le cadeau parfait pour vous en 10 secondes.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 font-bold text-indigo-500 whitespace-nowrap">
              Essayer l'Assistant
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="mb-12 bg-card border rounded-3xl p-6 md:p-8 shadow-xl animate-in zoom-in-95 duration-300">
      <div className="flex items-center gap-4 mb-8 border-b pb-6">
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-100 to-pink-100 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-indigo-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Assistant Cadeau IA</h2>
          <p className="text-sm text-muted-foreground">Parlez-nous du destinataire</p>
        </div>
        <button onClick={() => setIsOpen(false)} className="ml-auto text-muted-foreground hover:text-foreground text-sm font-medium">
          Fermer
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Âge approximatif</label>
            <input 
              type="number" 
              placeholder="Ex: 30" 
              className="w-full p-3 bg-muted border-transparent focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl outline-none transition-all"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Genre (Optionnel)</label>
            <select 
              className="w-full p-3 bg-muted border-transparent focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl outline-none transition-all"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            >
              <option>Peu importe</option>
              <option>Homme</option>
              <option>Femme</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Centres d'intérêt ou personnalité <span className="text-red-500">*</span></label>
            <textarea 
              required
              placeholder="Ex: Aime voyager, le bon vin, la technologie, et faire du sport..." 
              className="w-full p-3 bg-muted border-transparent focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl outline-none transition-all resize-none h-24"
              value={formData.interests}
              onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Budget maximum (€)</label>
            <input 
              type="number" 
              placeholder="Ex: 100" 
              className="w-full p-3 bg-muted border-transparent focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl outline-none transition-all"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading || !formData.interests}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-pink-500 text-white p-4 rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              L'IA analyse le catalogue...
            </>
          ) : (
            <>
              Trouver le cadeau parfait
              <Sparkles className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
