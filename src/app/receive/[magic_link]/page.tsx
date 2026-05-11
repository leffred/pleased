import { Suspense } from "react";
import { getGiftByMagicLink } from "../../actions/gift";
import ReceiveGiftClient from "./ReceiveGiftClient";
import { AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ReceiveGiftPage({ params }: { params: { magic_link: string } }) {
  // In Next.js 15, params is a Promise, so we must await it before accessing its properties
  const resolvedParams = await params;
  const { magic_link } = resolvedParams;

  const result = await getGiftByMagicLink(magic_link);

  if (!result.success || !result.gift) {
    return (
      <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 text-muted-foreground">
          <AlertCircle className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Cadeau Introuvable</h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          {result.error || "Le lien que vous avez utilisé est invalide ou expiré."}
        </p>
      </div>
    );
  }

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement...</div>}>
      <ReceiveGiftClient gift={result.gift as any} />
    </Suspense>
  );
}
