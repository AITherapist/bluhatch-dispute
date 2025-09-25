import { NextRequest, NextResponse } from 'next/server';
import { createClientComponentClient } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClientComponentClient();

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get evidence item with job verification
    const { data: evidence, error } = await supabase
      .from('evidence_items')
      .select(
        `
        *,
        jobs!inner(
          id,
          user_id
        )
      `
      )
      .eq('id', params.id)
      .eq('jobs.user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching evidence:', error);
      return NextResponse.json(
        { error: 'Evidence not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: evidence,
    });
  } catch (error) {
    console.error('Evidence fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
