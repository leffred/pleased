import { NextResponse } from "next/response";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { age, gender, interests, budget } = body;

    // 1. Fetch all products from the catalog
    const { data: products, error } = await supabase.from('products').select('id, name, description, price, category');
    
    if (error || !products) {
      throw new Error("Impossible de récupérer le catalogue.");
    }

    // 2. Prepare payload for n8n Webhook
    // L'URL du webhook n8n devra être configurée dans vos variables d'environnement
    // Pour l'instant, on utilise une URL de test/placeholder ou on mock la réponse si l'URL n'est pas définie.
    const n8nWebhookUrl = process.env.N8N_AI_WEBHOOK_URL;

    if (!n8nWebhookUrl) {
      console.warn("⚠️ N8N_AI_WEBHOOK_URL non définie. Renvoi d'un mock en attendant.");
      // MOCK : On renvoie aléatoirement 3 IDs parmi notre catalogue pour prouver que le front fonctionne.
      const shuffled = [...products].sort(() => 0.5 - Math.random());
      const mockIds = shuffled.slice(0, 3).map(p => p.id);
      
      // On simule le temps de traitement de l'IA (2 secondes)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return NextResponse.json({ productIds: mockIds });
    }

    // 3. Appeler n8n avec le profil utilisateur et le catalogue complet
    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        profile: {
          age: age || "Non précisé",
          gender: gender || "Peu importe",
          interests,
          budget: budget || "Aucune limite"
        },
        catalog: products // On envoie les ~20 produits
      })
    });

    if (!response.ok) {
      throw new Error("Le webhook n8n a échoué.");
    }

    // n8n est censé renvoyer un JSON : { "productIds": ["id1", "id2", "id3"] }
    const result = await response.json();

    return NextResponse.json(result);

  } catch (error: any) {
    console.error("AI Recommendation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
