import { getGiftByMagicLink } from "../../actions/gift";
import { createClient } from "@supabase/supabase-js";
import SwapClient from "./SwapClient";
import { AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SwapGiftPage({ params }: { params: { magic_link: string } }) {
  const resolvedParams = await params;
  const { magic_link } = resolvedParams;

  const result = await getGiftByMagicLink(magic_link);

  if (!result.success || !result.gift || result.gift.status !== "pending") {
    return (
      <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 text-muted-foreground">
          <AlertCircle className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Échange Impossible</h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          {result.error || "Ce cadeau ne peut plus être échangé ou a déjà été réclamé."}
        </p>
      </div>
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder";
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const productsData = result.gift.products as any;
  const originalProduct = Array.isArray(productsData) ? productsData[0] : productsData;

  const priceLimit = originalProduct?.price || 0;
  const currentProductId = originalProduct?.id;

  // Fetch alternative products (same or lower price, excluding current product, random order or just top 20)
  const { data: alternatives, error } = await supabase
    .from("products")
    .select("id, name, category, image_url, price")
    .lte("price", priceLimit)
    .neq("id", currentProductId)
    .limit(20);

  const profilesData = result.gift.profiles as any;
  const originalProfile = Array.isArray(profilesData) ? profilesData[0] : profilesData;

  const originalGiftInfo = {
    senderName: originalProfile?.full_name || "Quelqu'un",
    productName: originalProduct?.name || "Cadeau",
    price: priceLimit
  };

  return (
    <SwapClient 
      magicLink={magic_link} 
      originalGift={originalGiftInfo} 
      catalog={alternatives || []} 
    />
  );
}
