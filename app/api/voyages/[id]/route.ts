// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
export const dynamic = "force-dynamic";
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const { data: voyage, error } = await supabase
      .from('voyages')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching voyage:', error);
      return NextResponse.json({ error: 'Failed to fetch voyage' }, { status: 500 });
    }

    if (!voyage) {
      return NextResponse.json({ error: 'Voyage not found' }, { status: 404 });
    }

    return NextResponse.json({ voyage }, { status: 200 });
  } catch (error) {
    console.error('Error in voyage GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const { data: voyage, error } = await supabase
      .from('voyages')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating voyage:', error);
      return NextResponse.json({ error: 'Failed to update voyage' }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error updating voyage:', error);
    return NextResponse.json({ error: 'Failed to update voyage' }, { status: 500 });
  }
}
