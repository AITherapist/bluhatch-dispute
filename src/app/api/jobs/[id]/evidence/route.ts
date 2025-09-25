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

    // Verify job ownership
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('id')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single();

    if (jobError || !job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Get evidence for this job
    const { data: evidence, error } = await supabase
      .from('evidence_items')
      .select('*')
      .eq('job_id', params.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching evidence:', error);
      return NextResponse.json(
        { error: 'Failed to fetch evidence' },
        { status: 500 }
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
      .select('id')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single();

    if (jobError || !job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    const body = await request.json();
    const {
      evidence_type,
      description,
      file_path,
      file_hash,
      gps_latitude,
      gps_longitude,
      gps_accuracy,
      client_approval,
      client_signature,
    } = body;

    // Validate required fields
    if (!evidence_type || !description || !file_path || !file_hash) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create evidence item
    const { data: evidence, error } = await supabase
      .from('evidence_items')
      .insert({
        job_id: params.id,
        evidence_type,
        file_path,
        file_hash,
        gps_latitude: gps_latitude ? parseFloat(gps_latitude) : null,
        gps_longitude: gps_longitude ? parseFloat(gps_longitude) : null,
        gps_accuracy: gps_accuracy ? parseFloat(gps_accuracy) : null,
        device_timestamp: new Date().toISOString(),
        server_timestamp: new Date().toISOString(),
        description,
        client_approval: client_approval || false,
        client_signature: client_signature || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating evidence:', error);
      return NextResponse.json(
        { error: 'Failed to create evidence' },
        { status: 500 }
      );
    }

    // Update job protection status
    await updateJobProtectionStatus(params.id);

    return NextResponse.json({
      success: true,
      data: evidence,
    });
  } catch (error) {
    console.error('Evidence creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function updateJobProtectionStatus(jobId: string) {
  try {
    const supabase = createClientComponentClient();

    // Get all evidence for this job
    const { data: evidence, error } = await supabase
      .from('evidence_items')
      .select('evidence_type, client_approval, blockchain_timestamp')
      .eq('job_id', jobId);

    if (error) {
      console.error(
        'Error fetching evidence for protection calculation:',
        error
      );
      return;
    }

    // Calculate protection status based on evidence
    let protectionScore = 0;
    const evidenceTypes = new Set(evidence.map((e) => e.evidence_type));

    // Base score for different evidence types
    const typeScores = {
      before: 20,
      progress: 15,
      after: 25,
      defect: 20,
      approval: 20,
    };

    // Add scores for each evidence type
    evidenceTypes.forEach((type) => {
      protectionScore += typeScores[type as keyof typeof typeScores] || 0;
    });

    // Bonus for client approval
    const approvedCount = evidence.filter((e) => e.client_approval).length;
    protectionScore += approvedCount * 5;

    // Bonus for blockchain timestamping
    const timestampedCount = evidence.filter(
      (e) => e.blockchain_timestamp
    ).length;
    protectionScore += timestampedCount * 10;

    // Cap at 100%
    protectionScore = Math.min(protectionScore, 100);

    // Update job protection status
    await supabase
      .from('jobs')
      .update({ protection_status: protectionScore })
      .eq('id', jobId);
  } catch (error) {
    console.error('Error updating protection status:', error);
  }
}
