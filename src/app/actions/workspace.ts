"use server";

import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function payWithWorkspaceBalance(giftId: string, workspaceId: string, amountCents: number) {
  try {
    // 1. Fetch workspace balance
    const { data: workspace, error: wsError } = await supabase
      .from('workspaces')
      .select('balance')
      .eq('id', workspaceId)
      .single();

    if (wsError || !workspace) {
      return { success: false, error: "Espace entreprise introuvable." };
    }

    if (workspace.balance < amountCents) {
      return { success: false, error: "Solde insuffisant pour ce paiement." };
    }

    // 2. Deduct balance and update gift status
    // In a real production system, this should be a PostgreSQL transaction (RPC function)
    // to avoid race conditions. For MVP, we do it sequentially.
    
    const newBalance = workspace.balance - amountCents;

    const { error: updateWsError } = await supabase
      .from('workspaces')
      .update({ balance: newBalance })
      .eq('id', workspaceId);

    if (updateWsError) throw updateWsError;

    // 3. Insert transaction
    await supabase.from('transactions').insert({
      workspace_id: workspaceId,
      amount: -amountCents,
      type: 'gift_purchase',
      description: `Achat de cadeau`
    });

    // 4. Update gift
    const { error: giftError } = await supabase
      .from('gifts')
      .update({ 
        status: 'paid', // Or whatever status is next
        workspace_id: workspaceId 
      })
      .eq('id', giftId);

    if (giftError) throw giftError;

    return { success: true };

  } catch (err: any) {
    console.error("payWithWorkspaceBalance error:", err);
    return { success: false, error: "Erreur lors du paiement via le portefeuille." };
  }
}
