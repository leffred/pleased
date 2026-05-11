"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Briefcase, Plus, Users, Wallet } from "lucide-react";
import Link from "next/link";

export default function DashboardWorkspaces() {
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchWorkspaces = async () => {
    setLoading(true);
    // On the frontend, RLS policy "Users can view their workspaces" will ensure we only get ours
    const { data: memberData } = await supabase
      .from('workspace_members')
      .select('workspace_id')
      
    if (memberData && memberData.length > 0) {
      const workspaceIds = memberData.map(m => m.workspace_id);
      const { data } = await supabase
        .from('workspaces')
        .select('*')
        .in('id', workspaceIds)
        .order('created_at', { ascending: false });
        
      setWorkspaces(data || []);
    } else {
      setWorkspaces([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkspaceName.trim()) return;

    setCreating(true);
    try {
      // Create the workspace
      const { data: workspace, error: wsError } = await supabase
        .from('workspaces')
        .insert({ name: newWorkspaceName })
        .select()
        .single();

      if (wsError) throw wsError;

      // Get current user id
      const { data: { session } } = await supabase.auth.getSession();
      
      // In a real app we'd get the actual user ID from auth.
      // Since this app might be relying on simulated auth right now (like a static profile),
      // we need to see how profiles are handled. Let's assume we can fetch the first profile for now
      // or rely on RLS if authenticated.
      // Actually, if we are not logged in via Supabase Auth, we can't insert into workspace_members without profile_id.
      // Wait! Let's fetch a profile to assign as owner.
      const { data: profiles } = await supabase.from('profiles').select('id').limit(1);
      const profileId = profiles?.[0]?.id;

      if (workspace && profileId) {
        await supabase
          .from('workspace_members')
          .insert({
            workspace_id: workspace.id,
            profile_id: profileId,
            role: 'admin'
          });
      }

      setNewWorkspaceName("");
      setShowCreateModal(false);
      fetchWorkspaces();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la création de l'espace entreprise.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Espaces Entreprises</h1>
          <p className="text-muted-foreground">Gérez vos budgets partagés et offrez des cadeaux en un clic.</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 w-fit"
        >
          <Plus className="w-4 h-4" />
          Nouvel espace
        </button>
      </div>

      {loading ? (
        <div className="text-center text-muted-foreground py-12">Chargement de vos espaces...</div>
      ) : workspaces.length === 0 ? (
        <div className="text-center bg-card border rounded-3xl p-12 shadow-sm">
          <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-bold mb-2">Aucun espace entreprise</h3>
          <p className="text-muted-foreground mb-6">Créez un espace pour simplifier la facturation de vos cadeaux d'affaires.</p>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors inline-block"
          >
            Créer mon premier espace
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaces.map((workspace) => (
            <Link 
              key={workspace.id} 
              href={`/dashboard/workspaces/${workspace.id}`}
              className="bg-card border rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-primary/50 transition-all group flex flex-col"
            >
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-1">{workspace.name}</h3>
              <p className="text-muted-foreground text-sm flex-grow mb-6">Espace entreprise</p>
              
              <div className="flex items-center justify-between border-t pt-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Wallet className="w-4 h-4 text-muted-foreground" />
                  <span>{(workspace.balance / 100).toFixed(2)} €</span>
                </div>
                <div className="text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  Gérer &rarr;
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background max-w-md w-full rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-bold mb-2">Créer un espace</h2>
            <p className="text-muted-foreground mb-6">Nommez votre espace entreprise (ex: Pleased France, Équipe RH).</p>
            
            <form onSubmit={handleCreateWorkspace}>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Nom de l'entreprise</label>
                <input 
                  required 
                  autoFocus
                  type="text" 
                  value={newWorkspaceName} 
                  onChange={e => setNewWorkspaceName(e.target.value)} 
                  placeholder="Acme Corp" 
                  className="w-full p-3 bg-muted border border-transparent focus:border-primary rounded-xl outline-none transition-all" 
                />
              </div>
              
              <div className="flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-muted text-foreground py-3 rounded-xl font-medium hover:bg-muted/80 transition-colors"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  disabled={creating || !newWorkspaceName.trim()}
                  className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {creating ? "Création..." : "Créer l'espace"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
