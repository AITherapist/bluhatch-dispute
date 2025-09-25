import { NextRequest, NextResponse } from 'next/server';
import { createClientComponentClient } from '@/lib/supabase';
import { verifyTimestamp } from '@/lib/opentimestamps';

export async function POST(
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
    const { data: evidence, error: fetchError } = await supabase
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

    if (fetchError || !evidence) {
      return NextResponse.json(
        { error: 'Evidence not found' },
        { status: 404 }
      );
    }

    if (!evidence.blockchain_timestamp) {
      return NextResponse.json(
        { error: 'No blockchain timestamp found' },
        { status: 400 }
      );
    }

    // Verify the timestamp
    const isVerified = await verifyTimestamp(evidence.blockchain_timestamp);

    return NextResponse.json({
      success: true,
      data: {
        verified: isVerified,
        timestamp: evidence.blockchain_timestamp,
        verifiedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Timestamp verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
