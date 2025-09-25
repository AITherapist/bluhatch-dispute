import { NextRequest, NextResponse } from 'next/server';
import { createClientComponentClient } from '@/lib/supabase';
import { generateReport } from '@/lib/report-generator';

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

    // Verify job ownership
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single();

    if (jobError || !job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Get all evidence for this job
    const { data: evidence, error: evidenceError } = await supabase
      .from('evidence_items')
      .select('*')
      .eq('job_id', params.id)
      .order('created_at', { ascending: true });

    if (evidenceError) {
      console.error('Error fetching evidence:', evidenceError);
      return NextResponse.json(
        { error: 'Failed to fetch evidence' },
        { status: 500 }
      );
    }

    // Generate the report
    const reportData = {
      job,
      evidence,
      user: {
        id: user.id,
        email: user.email || 'unknown@example.com',
      },
    };

    const report = await generateReport(reportData);

    return NextResponse.json({
      success: true,
      data: {
        reportUrl: report.url,
        reportId: report.id,
        generatedAt: report.generatedAt,
        evidenceCount: evidence.length,
        protectionScore: job.protection_status,
      },
    });
  } catch (error) {
    console.error('Report generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
