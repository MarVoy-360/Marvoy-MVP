import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { voyageId: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sofActivities = await prisma.sOFActivity.findMany({
      where: { voyageId: params.voyageId },
      orderBy: { eventTime: "asc" },
    });

    return NextResponse.json(sofActivities);
  } catch (error) {
    console.error("Failed to fetch SOF activities:", error);
    return NextResponse.json({ error: "Failed to fetch SOF activities" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { voyageId: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { portCallId, eventType, eventTime, remarks } = body;

    const sofActivity = await prisma.sOFActivity.create({
      data: {
        voyageId: params.voyageId,
        portCallId,
        eventType,
        eventTime: new Date(eventTime),
        remarks,
      },
    });

    return NextResponse.json(sofActivity, { status: 201 });
  } catch (error) {
    console.error("Failed to create SOF activity:", error);
    return NextResponse.json({ error: "Failed to create SOF activity" }, { status: 500 });
  }
}
