// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma/client";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ voyageId: string }> }
) {
  try {
    const { voyageId } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: Implement full laytime calculation logic
    // This is a placeholder that returns sample data
    const result = {
      timeUsed: "48 hours",
      timeAllowed: "72 hours",
      result: "Despatch: 24 hours",
      calculatedAt: new Date().toISOString(),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Calculation failed:", error);
    return NextResponse.json({ error: "Calculation failed" }, { status: 500 });
  }
}
