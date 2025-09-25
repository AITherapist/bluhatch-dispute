import { NextRequest, NextResponse } from 'next/server';
import { createClientComponentClient } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string } }
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

    // Verify job ownership
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('id')
      .eq('id', params.jobId)
      .eq('user_id', user.id)
      .single();

    if (jobError || !job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Get all approvals for this job
    const { data: approvals, error } = await supabase
      .from('evidence_items')
      .select('*')
      .eq('job_id', params.jobId)
      .eq('client_approval', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching approvals:', error);
      return NextResponse.json(
        { error: 'Failed to fetch approvals' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: approvals,
    });
  } catch (error) {
    console.error('Approvals fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
