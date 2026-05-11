"use client";

import { useState } from "react";
import { Gift, MapPin, RefreshCw, Loader2, AlertCircle } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { acceptGiftWithSwap } from "../../actions/gift";

type GiftData = {
  id: string;
  magic_link: string;
  message: string;
  status: string;
  products: {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url: string;
    category: string;
  };
  profiles: {
    full_name: string;
  };
};

export default function ReceiveGiftClient({ gift }: { gift: GiftData }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const swappedProductId = searchParams.get("swap");
  
  const initialStep = swappedProductId ? "address" : "unwrap";
  const [step, setStep] = useState<"unwrap" | "message" | "address" | "success">(initialStep);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");

  const handleSwap = () => {
    router.push(`/swap/${gift.magic_link}`);
  };

  const handleAccept = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await acceptGiftWithSwap(gift.magic_link, swappedProductId, {
      address,
      postalCode,
      city
    });

    setLoading(false);

    if (result.success) {
      setStep("success");
    } else {
      setError(result.error || "Une erreur est survenue");
    }
  };

  if (gift.status !== "pending") {
    return (
      <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 text-muted-foreground">
          <AlertCircle className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Cadeau Indisponible</h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Ce cadeau a déjà été réclamé ou n'est plus valide.
        </p>
      </div>
    );
  }

  const originalProduct = Array.isArray(gift.products) ? gift.products[0] : gift.products;
  const originalProfile = Array.isArray(gift.profiles) ? gift.profiles[0] : gift.profiles;

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-4">
      
      {step === "unwrap" && (
        <div className="text-center animate-in fade-in zoom-in duration-700">
          <div className="w-32 h-32 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 text-primary cursor-pointer hover:scale-105 transition-transform" onClick={() => setStep("message")}>
            <Gift className="w-16 h-16 animate-bounce" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Vous avez reçu un cadeau !</h1>
          <p className="text-muted-foreground text-lg mb-8">Cliquez sur le paquet pour l'ouvrir.</p>
          <button onClick={() => setStep("message")} className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold text-lg hover:bg-primary/90 transition-all">
            Déballer le cadeau
          </button>
        </div>
      )}

      {step === "message" && (
        <div className="max-w-md w-full bg-card rounded-3xl p-8 shadow-xl border text-center animate-in slide-in-from-bottom-8 fade-in duration-500">
          <div className="w-24 h-24 mx-auto mb-6 rounded-2xl overflow-hidden bg-muted">
            <img src={originalProduct?.image_url} alt="Cadeau" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-2xl font-bold mb-2">{originalProfile?.full_name || "Quelqu'un"} vous a offert :</h2>
          <p className="text-xl text-primary font-medium mb-6">{originalProduct?.name}</p>
          
          <div className="bg-muted/50 p-6 rounded-2xl mb-8 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl">❝</div>
            <p className="italic text-muted-foreground pt-2">{gift.message}</p>
          </div>

          <button onClick={() => setStep("address")} className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold hover:bg-primary/90 transition-all mb-4">
            Accepter le cadeau
          </button>
          
          <button onClick={handleSwap} className="w-full flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors py-2 text-sm font-medium">
            <RefreshCw className="w-4 h-4" />
            Échanger contre autre chose
          </button>
        </div>
      )}

      {step === "address" && (
        <div className="max-w-md w-full bg-card rounded-3xl p-8 shadow-xl border animate-in slide-in-from-right-8 fade-in duration-500">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary/10 p-2 rounded-full text-primary">
              <MapPin className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">Où l'envoyer ?</h2>
          </div>
          <p className="text-muted-foreground mb-8">
            {gift.profiles.full_name} ne verra pas votre adresse. Vos données sont sécurisées.
          </p>

          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-sm mb-6 text-center">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleAccept}>
            <div>
              <label className="block text-sm font-medium mb-2">Adresse postale</label>
              <input required type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="123 rue de la Paix" className="w-full p-3 bg-muted border border-transparent focus:border-primary rounded-xl outline-none transition-all" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Code Postal</label>
                <input required type="text" value={postalCode} onChange={e => setPostalCode(e.target.value)} placeholder="75001" className="w-full p-3 bg-muted border border-transparent focus:border-primary rounded-xl outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Ville</label>
                <input required type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="Paris" className="w-full p-3 bg-muted border border-transparent focus:border-primary rounded-xl outline-none transition-all" />
              </div>
            </div>
            
            <button disabled={loading} type="submit" className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold hover:bg-primary/90 transition-all mt-8 flex items-center justify-center">
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Valider l'expédition"}
            </button>
          </form>
        </div>
      )}

      {step === "success" && (
        <div className="text-center animate-in zoom-in fade-in duration-500">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-4">C'est validé !</h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Votre cadeau va être préparé avec soin. Vous recevrez bientôt un email avec le suivi de livraison.
          </p>
        </div>
      )}

    </div>
  );
}
