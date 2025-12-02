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
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const charterParties = await prisma.charterParty.findMany({
      where: {
        voyageId: voyageId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(charterParties);
  } catch (error) {
    console.error("Failed to fetch charter parties:", error);
    return NextResponse.json(
      { error: "Failed to fetch charter parties" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ voyageId: string }> }
) {
  try {
    const { voyageId } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      cpNumber,
      cpDate,
      laycanStart,
      laycanEnd,
      laytimeAllowed,
      laytimeUnit,
      terms,
      demurrageRate,
      despatchRate,
      despatchPercentage,
      reversible,
      proRatable,
      shinc,
      shex,
      notes,
    } = body;

    const charterParty = await prisma.charterParty.create({
      data: {
        voyageId: voyageId,
        cpNumber,
        cpDate: cpDate ? new Date(cpDate) : undefined,
        laycanStart: laycanStart ? new Date(laycanStart) : undefined,
        laycanEnd: laycanEnd ? new Date(laycanEnd) : undefined,
        laytimeAllowed: parseFloat(laytimeAllowed),
        laytimeUnit,
        terms,
        demurrageRate: parseFloat(demurrageRate),
        despatchRate: despatchRate ? parseFloat(despatchRate) : null,
        despatchPercentage: despatchPercentage
          ? parseFloat(despatchPercentage)
          : null,
        reversible: reversible || false,
        proRatable: proRatable || false,
        shinc: shinc || false,
        shex: shex || false,
        notes,
      },
    });

    return NextResponse.json(charterParty, { status: 201 });
  } catch (error) {
    console.error("Failed to create charter party:", error);
    return NextResponse.json(
      { error: "Failed to create charter party" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ voyageId: string }> }
) {
  try {
    const { voyageId } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { charterPartyId } = await request.json();

    await prisma.charterParty.delete({
      where: {
        id: charterPartyId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete charter party:", error);
    return NextResponse.json(
      { error: "Failed to delete charter party" },
      { status: 500 }
    );
  }
}
