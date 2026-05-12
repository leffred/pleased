"use client";

import { useState } from "react";
import Link from "next/link";
import { Gift, Mail, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      console.error("Magic link error:", error);
      setStatus("idle");
      alert(error.message);
    } else {
      setStatus("success");
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-4">
      <Link href="/" className="flex items-center gap-2 mb-12 text-foreground hover:opacity-80 transition-opacity">
        <Gift className="w-8 h-8 text-primary" />
        <span className="font-bold text-2xl tracking-tight">Pleased</span>
      </Link>

      <div className="w-full max-w-md bg-card rounded-3xl p-8 shadow-xl border">
        {status === "success" ? (
          <div className="text-center animate-in zoom-in fade-in duration-500">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Vérifiez vos emails</h2>
            <p className="text-muted-foreground mb-8">
              Nous avons envoyé un lien magique à <br />
              <span className="font-medium text-foreground">{email}</span>
            </p>
            <button 
              onClick={() => setStatus("idle")} 
              className="text-sm font-medium text-primary hover:underline"
            >
              Utiliser une autre adresse
            </button>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold mb-2 text-center">Bienvenue</h2>
            <p className="text-muted-foreground text-center mb-8">Connectez-vous à votre espace personnel.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">Adresse email</label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input 
                    id="email"
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@exemple.com" 
                    className="w-full pl-12 pr-4 py-4 bg-muted border border-transparent focus:border-primary rounded-xl outline-none transition-all"
                    disabled={status === "loading"}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={status === "loading" || !email}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-70"
              >
                {status === "loading" ? "Envoi du lien..." : "Recevoir mon lien magique"}
                {status !== "loading" && <ArrowRight className="w-5 h-5" />}
              </button>
            </form>

            <p className="text-center text-xs text-muted-foreground mt-8">
              En continuant, vous acceptez nos <Link href="#" className="underline">Conditions d'utilisation</Link> et notre <Link href="#" className="underline">Politique de confidentialité</Link>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
