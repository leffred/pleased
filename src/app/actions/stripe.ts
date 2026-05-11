"use server";

import Stripe from "stripe";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-04-22.dahlia", // Mise à jour pour correspondre aux types du package Stripe
});

export async function createCheckoutSession(giftId: string, price: number, productName: string, imageUrl: string) {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      client_reference_id: giftId, // Important: This is how n8n will link the payment to the gift in Supabase
      metadata: {
        giftId: giftId
      },
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: productName,
              images: [imageUrl],
            },
            unit_amount: Math.round(price * 100), // Stripe expects amounts in cents
          },
          quantity: 1,
        },
        // We add the Pleased service fee
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Frais de service Pleased",
              description: "Livraison, personnalisation et gestion des échanges",
            },
            unit_amount: 350, // 3.50€
          },
          quantity: 1,
        }
      ],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?productId=${giftId}`, // Go back to checkout if canceled
    });

    return { url: session.url };
  } catch (error: any) {
    console.error("Stripe error:", error);
    return { error: error.message };
  }
}

export async function createPoolContributionSession(poolId: string, amount: number, poolTitle: string, participantName: string, participantMessage: string) {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      client_reference_id: poolId, // Pour n8n
      metadata: {
        poolId: poolId,
        participantName: participantName,
        participantMessage: participantMessage
      },
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Participation à la cagnotte : ${poolTitle}`,
              description: `De la part de ${participantName}`,
            },
            unit_amount: Math.round(amount * 100), // En centimes
          },
          quantity: 1,
        }
      ],
      success_url: `${origin}/group-gift/${poolId}?success=true`,
      cancel_url: `${origin}/group-gift/${poolId}`,
    });

    return { url: session.url };
  } catch (error: any) {
    console.error("Stripe pool error:", error);
    return { error: error.message };
  }
}

export async function createTopUpCheckoutSession(workspaceId: string, amountCents: number) {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      client_reference_id: workspaceId,
      metadata: {
        workspaceId: workspaceId,
        type: "workspace_topup"
      },
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Rechargement du portefeuille Entreprise`,
              description: `Ajout de fonds pour l'espace de travail`,
            },
            unit_amount: amountCents, // En centimes
          },
          quantity: 1,
        }
      ],
      success_url: `${origin}/dashboard/workspaces/${workspaceId}?success=true`,
      cancel_url: `${origin}/dashboard/workspaces/${workspaceId}`,
    });

    return { url: session.url };
  } catch (error: any) {
    console.error("Stripe topup error:", error);
    return { error: error.message };
  }
}
