// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
export const dynamic = "force-dynamic";
import prisma from '@/lib/prisma/client'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user from database to find their organization
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
      select: { organizationId: true, role: true }
    })

    if (!dbUser || !dbUser.organizationId) {
      return NextResponse.json({ error: 'User not associated with an organization' }, { status: 403 })
    }

    // Fetch voyages for the user's organization
    const voyages = await prisma.voyage.findMany({
      where: {
        organizationId: dbUser.organizationId
      },
      include: {
        portCalls: {
          orderBy: { sequence: 'asc' }
        },
        cargos: true,
        createdBy: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ voyages }, { status: 200 })
  } catch (error) {
    console.error('Error fetching voyages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch voyages' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user from database
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
      select: { id: true, organizationId: true, role: true }
    })

    if (!dbUser || !dbUser.organizationId) {
      return NextResponse.json({ error: 'User not associated with an organization' }, { status: 403 })
    }

    const body = await request.json()
    const { voyageNumber, vesselName, vesselIMO, status } = body

    // Validate required fields
    if (!voyageNumber || !vesselName) {
      return NextResponse.json(
        { error: 'Voyage number and vessel name are required' },
        { status: 400 }
      )
    }

    // Create voyage
    const voyage = await prisma.voyage.create({
      data: {
        voyageNumber,
        vesselName,
        vesselIMO: vesselIMO || null,
        status: status || 'ESTIMATE',
        organizationId: dbUser.organizationId,
        createdById: dbUser.id
      },
      include: {
        portCalls: true,
        cargos: true,
        createdBy: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({ voyage }, { status: 201 })
  } catch (error) {
    console.error('Error creating voyage:', error)
    return NextResponse.json(
      { error: 'Failed to create voyage' },
      { status: 500 }
    )
  }
}
