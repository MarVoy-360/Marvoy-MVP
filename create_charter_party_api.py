import os

# Charter Party API route content
charter_party_api_content = '''import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { voyageId: string } }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const charterParties = await prisma.charterParty.findMany({
      where: {
        voyageId: params.voyageId,
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
  { params }: { params: { voyageId: string } }
) {
  try {
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
        voyageId: params.voyageId,
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
  { params }: { params: { voyageId: string } }
) {
  try {
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
''';

# Create the directory if it doesn't exist
os.makedirs("app/api/voyages/[voyageId]/charter-parties", exist_ok=True)

# Write the file
with open("app/api/voyages/[voyageId]/charter-parties/route.ts", "w") as f:
    f.write(charter_party_api_content)

print("✅ Created Charter Party API route")
