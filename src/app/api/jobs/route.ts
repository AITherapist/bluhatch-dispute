import { NextRequest, NextResponse } from 'next/server';
import { createClientComponentClient } from '@/lib/supabase';

export async function GET() {
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

    // Get user's jobs
    const { data: jobs, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching jobs:', error);
      return NextResponse.json(
        { error: 'Failed to fetch jobs' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    console.error('Jobs fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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
    const {
      client_name,
      client_address,
      client_phone,
      job_type,
      job_description,
      contract_value,
      start_date,
    } = body;

    // Validate required fields
    if (!client_name || !client_address || !job_type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new job
    const { data: job, error } = await supabase
      .from('jobs')
      .insert({
        user_id: user.id,
        client_name,
        client_address,
        client_phone,
        job_type,
        job_description,
        contract_value: contract_value ? parseFloat(contract_value) : null,
        start_date: start_date || new Date().toISOString(),
        protection_status: 0, // Start with 0% protection
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating job:', error);
      return NextResponse.json(
        { error: 'Failed to create job' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: job,
    });
  } catch (error) {
    console.error('Job creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
