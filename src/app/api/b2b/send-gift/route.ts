import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createMassGifts } from "@/app/actions/workspace";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ") || authHeader.split(" ")[1] !== supabaseServiceKey) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { workspace_id, product_id, recipient_name, recipient_email, message } = body;

    if (!workspace_id || !product_id || !recipient_name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Fetch product price
    const { data: product } = await supabase.from('products').select('price').eq('id', product_id).single();
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const totalCostCents = Math.round((product.price + 3.50) * 100);

    // Re-use the mass gifts action for a single gift, but it provides the atomicity needed
    const result = await createMassGifts(
      workspace_id,
      product_id,
      [{ recipientName: recipient_name, recipientEmail: recipient_email || "", message: message || "" }],
      totalCostCents
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Gift created and balance deducted." }, { status: 200 });

  } catch (error) {
    console.error("send-gift API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
