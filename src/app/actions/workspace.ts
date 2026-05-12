"use server";

import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder";
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

export async function createMassGifts(
  workspaceId: string, 
  productId: string, 
  giftsData: { recipientName: string, recipientEmail: string, message: string }[],
  totalCostCents: number
) {
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

    if (workspace.balance < totalCostCents) {
      return { success: false, error: "Solde insuffisant pour cette campagne." };
    }

    // 2. Deduct balance
    const newBalance = workspace.balance - totalCostCents;
    const { error: updateWsError } = await supabase
      .from('workspaces')
      .update({ balance: newBalance })
      .eq('id', workspaceId);

    if (updateWsError) throw updateWsError;

    // 3. Insert transaction
    await supabase.from('transactions').insert({
      workspace_id: workspaceId,
      amount: -totalCostCents,
      type: 'gift_campaign',
      description: `Campagne de ${giftsData.length} cadeaux`
    });

    // 4. Insert all gifts
    const giftsToInsert = giftsData.map(g => ({
      workspace_id: workspaceId,
      product_id: productId,
      recipient_name: g.recipientName,
      recipient_email: g.recipientEmail,
      message: g.message,
      status: 'paid'
    }));

    const { data: insertedGifts, error: insertGiftsError } = await supabase
      .from('gifts')
      .insert(giftsToInsert)
      .select('id, magic_link_token');

    if (insertGiftsError) throw insertGiftsError;

    // Ideally here we would trigger n8n to send the emails for each inserted gift,
    // or rely on a database webhook (Supabase edge function or n8n listening to inserts).

    return { success: true, count: insertedGifts.length };

  } catch (err: any) {
    console.error("createMassGifts error:", err);
    return { success: false, error: "Erreur lors de la génération de la campagne." };
  }
}

