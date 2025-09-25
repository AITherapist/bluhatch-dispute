import { NextRequest, NextResponse } from 'next/server';
import { createClientComponentClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClientComponentClient();
    const body = await request.json();
    const { email, password, companyName } = body;

    if (!email || !password || !companyName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create user account
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          company_name: companyName,
        },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message:
        'Account created successfully. Please check your email to verify your account.',
      user: data.user,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
