// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
export const dynamic = "force-dynamic";
import prisma from '@/lib/prisma/client'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ voyageId: string }> }
) {
  try {
    const { voyageId } = await params;
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
      select: { organizationId: true }
    })

    if (!dbUser?.organizationId) {
      return NextResponse.json({ error: 'User not associated with organization' }, { status: 403 })
    }

    // Verify voyage belongs to user's organization
    const voyage = await prisma.voyage.findFirst({
      where: {
        id: voyageId,
        organizationId: dbUser.organizationId
      }
    })

    if (!voyage) {
      return NextResponse.json({ error: 'Voyage not found' }, { status: 404 })
    }

    const portCalls = await prisma.portCall.findMany({
      where: { voyageId: voyageId },
      orderBy: { sequence: 'asc' },
      include: {
        activities: {
          orderBy: { activityTime: 'asc' }
        },
        cargoLoads: true,
        cargoDischarges: true
      }
    })

    return NextResponse.json({ portCalls }, { status: 200 })
  } catch (error) {
    console.error('Error fetching port calls:', error)
    return NextResponse.json({ error: 'Failed to fetch port calls' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ voyageId: string }> }
) {
  try {
    const { voyageId } = await params;
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
      select: { organizationId: true }
    })

    if (!dbUser?.organizationId) {
      return NextResponse.json({ error: 'User not associated with organization' }, { status: 403 })
    }

    // Verify voyage belongs to user's organization
    const voyage = await prisma.voyage.findFirst({
      where: {
        id: voyageId,
        organizationId: dbUser.organizationId
      }
    })

    if (!voyage) {
      return NextResponse.json({ error: 'Voyage not found' }, { status: 404 })
    }

    const body = await request.json()
    const { portName, portCode, country, sequence, eta, etd, status } = body

    if (!portName || sequence === undefined) {
      return NextResponse.json(
        { error: 'Port name and sequence are required' },
        { status: 400 }
      )
    }

    const portCall = await prisma.portCall.create({
      data: {
        voyageId: voyageId,
        portName,
        portCode: portCode || null,
        country: country || null,
        sequence,
        eta: eta ? new Date(eta) : null,
        etd: etd ? new Date(etd) : null,
        status: status || 'PLANNED'
      },
      include: {
        activities: true,
        cargoLoads: true,
        cargoDischarges: true
      }
    })

    return NextResponse.json({ portCall }, { status: 201 })
  } catch (error) {
    console.error('Error creating port call:', error)
    return NextResponse.json({ error: 'Failed to create port call' }, { status: 500 })
  }
}
