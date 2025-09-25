import { NextRequest, NextResponse } from 'next/server';
import { createClientComponentClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { evidenceId, signature, clientName } = body;

    if (!evidenceId || !signature || !clientName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify evidence ownership
    const { data: evidence, error: evidenceError } = await supabase
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
      .eq('id', evidenceId)
      .eq('jobs.user_id', user.id)
      .single();

    if (evidenceError || !evidence) {
      return NextResponse.json(
        { error: 'Evidence not found' },
        { status: 404 }
      );
    }

    // Update evidence with client signature
    const { data: updatedEvidence, error: updateError } = await supabase
      .from('evidence_items')
      .update({
        client_signature: signature,
        client_approval: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', evidenceId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating evidence:', updateError);
      return NextResponse.json(
        { error: 'Failed to update evidence' },
        { status: 500 }
      );
    }

    // Log the approval action
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'client_approval',
      details: {
        evidence_id: evidenceId,
        client_name: clientName,
        signature_captured: true,
      },
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      data: updatedEvidence,
    });
  } catch (error) {
    console.error('Signature capture error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
