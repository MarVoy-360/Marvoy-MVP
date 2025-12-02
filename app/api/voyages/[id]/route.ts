import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma/client'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
      select: { organizationId: true }
    })

    if (!dbUser || !dbUser.organizationId) {
      return NextResponse.json({ error: 'User not associated with organization' }, { status: 403 })
    }

    const voyage = await prisma.voyage.findFirst({
      where: {
        id: params.id,
        organizationId: dbUser.organizationId
      },
      include: {
        portCalls: {
          orderBy: { sequence: 'asc' },
          include: {
            activities: {
              orderBy: { activityTime: 'asc' }
            },
            cargoLoads: true,
            cargoDischarges: true
          }
        },
        cargos: {
          include: {
            loadPort: true,
            dischargePort: true
          }
        },
        charterParties: {
          include: {
            calculations: {
              orderBy: { calculatedAt: 'desc' }
            }
          }
        },
        createdBy: {
          select: { name: true, email: true }
        }
      }
    })

    if (!voyage) {
      return NextResponse.json({ error: 'Voyage not found' }, { status: 404 })
    }

    return NextResponse.json({ voyage }, { status: 200 })
  } catch (error) {
    console.error('Error fetching voyage:', error)
    return NextResponse.json({ error: 'Failed to fetch voyage' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
      select: { organizationId: true }
    })

    if (!dbUser || !dbUser.organizationId) {
      return NextResponse.json({ error: 'User not associated with organization' }, { status: 403 })
    }

    const body = await request.json()
    const { voyageNumber, vesselName, vesselIMO, status } = body

    const voyage = await prisma.voyage.updateMany({
      where: {
        id: params.id,
        organizationId: dbUser.organizationId
      },
      data: {
        ...(voyageNumber && { voyageNumber }),
        ...(vesselName && { vesselName }),
        ...(vesselIMO !== undefined && { vesselIMO }),
        ...(status && { status })
      }
    })

    if (voyage.count === 0) {
      return NextResponse.json({ error: 'Voyage not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Error updating voyage:', error)
    return NextResponse.json({ error: 'Failed to update voyage' }, { status: 500 })
  }
}
