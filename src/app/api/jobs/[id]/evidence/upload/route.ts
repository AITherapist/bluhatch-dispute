import { NextRequest, NextResponse } from 'next/server';
import { createClientComponentClient } from '@/lib/supabase';
import { createHash } from 'crypto';
import { submitToOpenTimestamps } from '@/lib/opentimestamps';

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

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const evidenceType = formData.get('evidence_type') as string;
    const description = formData.get('description') as string;
    const gpsLatitude = formData.get('gps_latitude') as string;
    const gpsLongitude = formData.get('gps_longitude') as string;
    const gpsAccuracy = formData.get('gps_accuracy') as string;

    if (!file || !evidenceType || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate file hash
    const fileBuffer = await file.arrayBuffer();
    const fileHash = createHash('sha256')
      .update(Buffer.from(fileBuffer))
      .digest('hex');

    // Upload file to Supabase Storage
    const fileName = `${user.id}/${params.id}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('evidence-files')
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('evidence-files')
      .getPublicUrl(fileName);

    // Submit to OpenTimestamps for blockchain timestamping
    let blockchainTimestamp = null;
    try {
      const timestampResult = await submitToOpenTimestamps(
        Buffer.from(fileBuffer)
      );
      if (timestampResult.success) {
        blockchainTimestamp = timestampResult.timestamp;
      }
    } catch (error) {
      console.error('Error submitting to OpenTimestamps:', error);
      // Continue without blockchain timestamp if it fails
    }

    // Create evidence item
    const { data: evidence, error: evidenceError } = await supabase
      .from('evidence_items')
      .insert({
        job_id: params.id,
        evidence_type: evidenceType,
        file_path: urlData.publicUrl,
        file_hash: fileHash,
        gps_latitude: gpsLatitude ? parseFloat(gpsLatitude) : null,
        gps_longitude: gpsLongitude ? parseFloat(gpsLongitude) : null,
        gps_accuracy: gpsAccuracy ? parseFloat(gpsAccuracy) : null,
        blockchain_timestamp: blockchainTimestamp,
        device_timestamp: new Date().toISOString(),
        server_timestamp: new Date().toISOString(),
        description,
        client_approval: false,
        client_signature: null,
      })
      .select()
      .single();

    if (evidenceError) {
      console.error('Error creating evidence:', evidenceError);
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
    console.error('Evidence upload error:', error);
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
