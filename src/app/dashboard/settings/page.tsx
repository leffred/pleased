"use client";

import { useState } from "react";
import { User, Mail, Bell, Shield, Key } from "lucide-react";

export default function DashboardSettings() {
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Paramètres du compte</h1>
        <p className="text-muted-foreground">Gérez vos informations personnelles et vos préférences.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Profil */}
        <section className="bg-card border rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary/10 p-2 rounded-xl text-primary">
              <User className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold">Profil Public</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Prénom</label>
              <input type="text" defaultValue="Thomas" className="w-full p-3 bg-muted border-transparent focus:border-primary rounded-xl outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Nom</label>
              <input type="text" defaultValue="Lefebvre" className="w-full p-3 bg-muted border-transparent focus:border-primary rounded-xl outline-none transition-all" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="email" defaultValue="thomas@example.com" disabled className="w-full pl-10 p-3 bg-muted/50 border-transparent rounded-xl outline-none text-muted-foreground cursor-not-allowed" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">L'email ne peut pas être modifié. Contactez le support si besoin.</p>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="bg-card border rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary/10 p-2 rounded-xl text-primary">
              <Bell className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold">Préférences de Notification</h2>
          </div>
          
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-muted/50 rounded-xl cursor-pointer hover:bg-muted transition-colors">
              <div>
                <div className="font-medium">Mises à jour de livraison</div>
                <div className="text-sm text-muted-foreground">Soyez notifié quand le cadeau est expédié et livré.</div>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary" />
            </label>
            <label className="flex items-center justify-between p-4 bg-muted/50 rounded-xl cursor-pointer hover:bg-muted transition-colors">
              <div>
                <div className="font-medium">Nouveaux cadeaux (Newsletter)</div>
                <div className="text-sm text-muted-foreground">Recevez nos meilleures sélections de cadeaux une fois par mois.</div>
              </div>
              <input type="checkbox" className="w-5 h-5 accent-primary" />
            </label>
          </div>
        </section>

        <div className="flex items-center justify-end gap-4">
          {saved && (
            <span className="text-green-600 font-medium animate-in fade-in">Modifications enregistrées !</span>
          )}
          <button type="submit" className="bg-foreground text-background px-8 py-3 rounded-xl font-bold hover:bg-foreground/90 transition-colors">
            Enregistrer les modifications
          </button>
        </div>
      </form>
    </div>
  );
}
