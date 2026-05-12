"use server";

import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder";

// We use the service role key to bypass RLS for server actions as we don't have authenticated users for receiving gifts
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function createPendingGift(productId: string, recipientName: string, message: string, senderId?: string) {
  try {
    const { data: gift, error } = await supabase.from('gifts').insert({
      product_id: productId,
      recipient_name: recipientName,
      message: message,
      sender_id: senderId || null,
      status: 'pending_payment'
    }).select().single();

    if (error) throw error;
    return { success: true, gift };
  } catch (err: any) {
    console.error("createPendingGift error:", err);
    return { success: false, error: err.message };
  }
}

export async function getGiftByMagicLink(magicLink: string) {
  const { data, error } = await supabase
    .from("gifts")
    .select(`
      id,
      magic_link,
      message,
      status,
      product_id,
      products (
        id,
        name,
        description,
        price,
        image_url,
        category
      ),
      sender_id,
      profiles (
        full_name
      )
    `)
    .eq("magic_link", magicLink)
    .single();

  if (error) {
    console.error("Error fetching gift by magic link:", error);
    return { success: false, error: "Cadeau introuvable ou expiré." };
  }

  return { success: true, gift: data };
}

export async function acceptGiftWithSwap(
  magicLink: string,
  newProductId: string | null,
  shippingDetails: { address: string; postalCode: string; city: string }
) {
  try {
    // 1. Fetch the original gift
    const { data: gift, error: giftError } = await supabase
      .from("gifts")
      .select("id, product_id, status, products(price)")
      .eq("magic_link", magicLink)
      .single();

    if (giftError || !gift) {
      return { success: false, error: "Cadeau introuvable." };
    }

    if (gift.status !== "pending") {
      return { success: false, error: "Ce cadeau a déjà été réclamé." };
    }

    const originalProductId = gift.product_id;
    const productsData = gift.products as any;
    const originalPrice = (Array.isArray(productsData) ? productsData[0]?.price : productsData?.price) || 0;

    let finalProductId = originalProductId;

    // 2. Validate swap if requested
    if (newProductId && newProductId !== originalProductId) {
      const { data: newProduct, error: newProductError } = await supabase
        .from("products")
        .select("price")
        .eq("id", newProductId)
        .single();

      if (newProductError || !newProduct) {
        return { success: false, error: "Le produit d'échange est introuvable." };
      }

      if (newProduct.price > originalPrice) {
        return { success: false, error: "Le prix du produit d'échange dépasse la valeur du cadeau initial." };
      }

      finalProductId = newProductId;
    }

    // 3. Update the gift record
    const { error: updateError } = await supabase
      .from("gifts")
      .update({
        product_id: finalProductId,
        original_product_id: finalProductId !== originalProductId ? originalProductId : null,
        status: "claimed",
        shipping_address: `${shippingDetails.address}, ${shippingDetails.postalCode} ${shippingDetails.city}`
      })
      .eq("magic_link", magicLink);

    if (updateError) {
      console.error("Error updating gift:", updateError);
      return { success: false, error: "Erreur lors de l'enregistrement de l'adresse." };
    }

    return { success: true };
  } catch (err) {
    console.error("Exception in acceptGiftWithSwap:", err);
    return { success: false, error: "Une erreur interne est survenue." };
  }
}
