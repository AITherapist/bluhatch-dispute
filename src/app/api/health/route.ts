import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { stripe } from '@/lib/stripe';
import { validateEnvironment } from '@/lib/env';

export async function GET() {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'unknown',
        stripe: 'unknown',
        environment: 'unknown',
      },
    };

    // Check environment variables
    try {
      validateEnvironment();
      health.services.environment = 'healthy';
    } catch {
      health.services.environment = 'unhealthy';
      health.status = 'unhealthy';
    }

    // Check Supabase connection
    try {
      const supabase = createServerClient();
      const { error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
      health.services.database = error ? 'unhealthy' : 'healthy';
    } catch {
      health.services.database = 'unhealthy';
      health.status = 'unhealthy';
    }

    // Check Stripe connection
    try {
      await stripe.prices.list({ limit: 1 });
      health.services.stripe = 'healthy';
    } catch {
      health.services.stripe = 'unhealthy';
      health.status = 'unhealthy';
    }

    const statusCode = health.status === 'healthy' ? 200 : 503;

    return NextResponse.json(health, { status: statusCode });
  } catch {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
      },
      { status: 503 }
    );
  }
}
