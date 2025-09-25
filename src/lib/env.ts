// Environment variable validation for production
export const validateEnvironment = () => {
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'STRIPE_SECRET_KEY',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'NEXT_PUBLIC_APP_URL',
  ];

  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }

  // Validate URLs
  try {
    new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!);
    new URL(process.env.NEXT_PUBLIC_APP_URL!);
  } catch {
    throw new Error('Invalid URL in environment variables');
  }

  // Validate Stripe keys format
  if (!process.env.STRIPE_SECRET_KEY!.startsWith('sk_')) {
    throw new Error('Invalid Stripe secret key format');
  }

  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!.startsWith('pk_')) {
    throw new Error('Invalid Stripe publishable key format');
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET!.startsWith('whsec_')) {
    throw new Error('Invalid Stripe webhook secret format');
  }

  console.log('✅ All environment variables are valid');
  return true;
};

// Production environment check
export const isProduction = () => {
  return process.env.NODE_ENV === 'production';
};

// Development environment check
export const isDevelopment = () => {
  return process.env.NODE_ENV === 'development';
};
