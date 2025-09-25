# Bluhatch Development Setup Guide

This guide will help you set up the complete development environment for the Bluhatch application.

## Prerequisites

- Node.js 18+ installed
- Git installed
- A Supabase account
- A Stripe account (for testing)

## Step 1: Environment Setup

1. **Copy the environment template:**

   ```bash
   cp env.example .env.local
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## Step 2: Supabase Setup

1. **Create a new Supabase project:**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Choose a region close to your users (EU for UK users)

2. **Get your project credentials:**
   - Go to Settings > API
   - Copy your Project URL and anon public key
   - Copy your service_role key (keep this secret!)

3. **Update your .env.local:**

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. **Set up the database:**
   - Go to the SQL Editor in your Supabase dashboard
   - Copy and paste the contents of `database-schema.sql`
   - Run the SQL to create all tables, policies, and functions

## Step 3: Stripe Setup

1. **Create a Stripe account:**
   - Go to [stripe.com](https://stripe.com)
   - Set up your account and get your API keys

2. **Create a subscription product:**
   - Go to Products in your Stripe dashboard
   - Create a new product: "Bluhatch Monthly Subscription"
   - Set price to £99.00/month
   - Copy the price ID

3. **Update your .env.local:**

   ```env
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   STRIPE_SUBSCRIPTION_PRICE_ID=price_your_price_id
   ```

4. **Set up webhooks:**
   - Go to Webhooks in your Stripe dashboard
   - Add endpoint: `https://your-domain.com/api/webhooks/stripe`
   - Select events: `customer.subscription.*`, `invoice.payment_*`
   - Copy the webhook secret

## Step 4: Development Commands

```bash
# Start development server
npm run dev

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check

# Build for production
npm run build

# Start production server
npm start
```

## Step 5: Code Quality Setup

The project includes:

- **ESLint** for code linting
- **Prettier** for code formatting
- **Husky** for pre-commit hooks
- **lint-staged** for staged file processing

These are automatically configured and will run on every commit.

## Step 6: Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── jobs/          # Job management endpoints
│   │   ├── evidence/      # Evidence capture endpoints
│   │   ├── approvals/     # Client approval endpoints
│   │   ├── reports/       # Report generation endpoints
│   │   ├── subscription/  # Subscription management
│   │   └── webhooks/      # Webhook handlers
│   ├── (auth)/           # Auth pages (login, register)
│   ├── dashboard/        # Main dashboard
│   ├── jobs/             # Job management pages
│   └── reports/          # Report pages
├── components/            # Reusable React components
├── lib/                   # Utility libraries
│   ├── supabase.ts       # Supabase client
│   ├── stripe.ts         # Stripe configuration
│   ├── opentimestamps.ts # Blockchain timestamping
│   └── utils.ts          # Utility functions
├── types/                # TypeScript type definitions
├── hooks/                # Custom React hooks
└── utils/                # Additional utilities
```

## Step 7: Testing the Setup

1. **Start the development server:**

   ```bash
   npm run dev
   ```

2. **Visit the application:**
   - Open [http://localhost:3000](http://localhost:3000)
   - You should see the Bluhatch application

3. **Test the database connection:**
   - Try to register a new user
   - Check your Supabase dashboard to see if the user was created

## Step 8: Deployment Preparation

For deployment to Render:

1. **Set up environment variables in Render:**
   - Copy all variables from your `.env.local`
   - Set `NEXT_PUBLIC_APP_URL` to your production URL

2. **Update Stripe webhook URL:**
   - Change webhook URL to your production domain
   - Update the webhook secret in your environment variables

## Troubleshooting

### Common Issues:

1. **Supabase connection errors:**
   - Check your environment variables
   - Ensure your Supabase project is active
   - Verify the database schema was created correctly

2. **Stripe webhook errors:**
   - Ensure your webhook URL is accessible
   - Check that you're using the correct webhook secret
   - Verify the webhook events are selected correctly

3. **Build errors:**
   - Run `npm run lint` to check for linting issues
   - Run `npm run format` to fix formatting issues
   - Check that all dependencies are installed

### Getting Help:

- Check the [DEVELOPMENT_SPECIFICATION.md](./DEVELOPMENT_SPECIFICATION.md) for detailed requirements
- Review the [Next.js documentation](https://nextjs.org/docs)
- Check the [Supabase documentation](https://supabase.com/docs)
- Review the [Stripe documentation](https://stripe.com/docs)

## Next Steps

Once your environment is set up:

1. **Phase 1:** Implement authentication and subscription management
2. **Phase 2:** Build the core evidence capture system
3. **Phase 3:** Add legal enhancements and report generation
4. **Phase 4:** Polish, testing, and deployment

Follow the development phases outlined in the `DEVELOPMENT_SPECIFICATION.md` file.
