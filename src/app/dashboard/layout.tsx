import Link from "next/link";
import { Gift, LayoutDashboard, History, Settings, LogOut } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/20 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-background border-r flex flex-col p-4">
        <Link href="/" className="flex items-center gap-2 mb-8 mt-2 px-2">
          <Gift className="w-6 h-6 text-primary" />
          <span className="font-bold text-xl tracking-tight">Pleased</span>
        </Link>
        
        <nav className="flex flex-col gap-2 flex-grow">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium">
            <LayoutDashboard className="w-5 h-5" />
            Vue d'ensemble
          </Link>
          <Link href="/dashboard/history" className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors font-medium">
            <History className="w-5 h-5" />
            Historique
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors font-medium">
            <Settings className="w-5 h-5" />
            Paramètres
          </Link>
        </nav>

        <div className="mt-auto pt-4 border-t">
          <button className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors font-medium">
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
