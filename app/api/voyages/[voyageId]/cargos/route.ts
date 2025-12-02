import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma/client'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { voyageId: string } }
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

    if (!dbUser?.organizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const voyage = await prisma.voyage.findFirst({
      where: {
        id: params.voyageId,
        organizationId: dbUser.organizationId
      }
    })

    if (!voyage) {
      return NextResponse.json({ error: 'Voyage not found' }, { status: 404 })
    }

    const cargos = await prisma.cargo.findMany({
      where: { voyageId: params.voyageId },
      include: {
        loadPort: true,
        dischargePort: true
      }
    })

    return NextResponse.json({ cargos }, { status: 200 })
  } catch (error) {
    console.error('Error fetching cargos:', error)
    return NextResponse.json({ error: 'Failed to fetch cargos' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { voyageId: string } }
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

    if (!dbUser?.organizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const voyage = await prisma.voyage.findFirst({
      where: {
        id: params.voyageId,
        organizationId: dbUser.organizationId
      }
    })

    if (!voyage) {
      return NextResponse.json({ error: 'Voyage not found' }, { status: 404 })
    }

    const body = await request.json()
    const { cargoName, quantity, unit, loadPortId, dischargePortId, status } = body

    if (!cargoName || !quantity || !unit) {
      return NextResponse.json(
        { error: 'Cargo name, quantity, and unit are required' },
        { status: 400 }
      )
    }

    const cargo = await prisma.cargo.create({
      data: {
        voyageId: params.voyageId,
        cargoName,
        quantity: parseFloat(quantity),
        unit,
        loadPortId: loadPortId || null,
        dischargePortId: dischargePortId || null,
        status: status || 'PLANNED'
      },
      include: {
        loadPort: true,
        dischargePort: true
      }
    })

    return NextResponse.json({ cargo }, { status: 201 })
  } catch (error) {
    console.error('Error creating cargo:', error)
    return NextResponse.json({ error: 'Failed to create cargo' }, { status: 500 })
  }
}
