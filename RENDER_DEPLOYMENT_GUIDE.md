# Bluhatch Render Deployment Guide

This guide will help you deploy the Bluhatch application to Render for production testing and set up proper Stripe webhooks.

## Prerequisites

- Render account (free tier available)
- Supabase project set up
- Stripe account with API keys
- Git repository (GitHub recommended)

## Step 1: Prepare Your Repository

### 1.1 Push to GitHub

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial Bluhatch application setup"

# Create GitHub repository and push
git remote add origin https://github.com/AITherapist/bluhatch-dispute.git
git branch -M main
git push -u origin main
```

### 1.2 Create Production Environment File

Create `.env.production` file (DO NOT commit this):

```env
# Supabase Production
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key

# Stripe Production
STRIPE_SECRET_KEY=sk_live_your_live_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-render-app.onrender.com
NEXT_PUBLIC_APP_NAME=Bluhatch

# OpenTimestamps
OPENTIMESTAMPS_CALENDAR_URL=https://alice.btc.calendar.opentimestamps.org

# Security
JWT_SECRET=your_secure_jwt_secret_key
ENCRYPTION_KEY=your_secure_encryption_key
```

## Step 2: Deploy to Render

### 2.1 Create New Web Service

1. Go to [render.com](https://render.com) and sign in
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select your `bluhatch-dispute` repository

### 2.2 Configure Build Settings

- **Name**: `bluhatch-dispute` (or your preferred name)
- **Environment**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Node Version**: `18` (or latest LTS)

### 2.3 Set Environment Variables

In Render dashboard, go to Environment tab and add:

```
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
STRIPE_SECRET_KEY=sk_live_your_live_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
NEXT_PUBLIC_APP_URL=https://your-render-app.onrender.com
NEXT_PUBLIC_APP_NAME=Bluhatch
OPENTIMESTAMPS_CALENDAR_URL=https://alice.btc.calendar.opentimestamps.org
JWT_SECRET=your_secure_jwt_secret_key
ENCRYPTION_KEY=your_secure_encryption_key
```

### 2.4 Deploy

1. Click "Create Web Service"
2. Wait for build to complete (5-10 minutes)
3. Your app will be available at `https://your-app-name.onrender.com`

## Step 3: Set Up Stripe Webhooks

### 3.1 Create Webhook Endpoint

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. **Endpoint URL**: `https://your-render-app.onrender.com/api/webhooks/stripe`
4. **Description**: "Bluhatch Production Webhooks"

### 3.2 Select Events

Select these events:

- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `checkout.session.completed`

### 3.3 Get Webhook Secret

1. After creating the webhook, click on it
2. Copy the "Signing secret" (starts with `whsec_`)
3. Update your Render environment variable: `STRIPE_WEBHOOK_SECRET`

## Step 4: Configure Supabase for Production

### 4.1 Update Supabase Settings

1. Go to your Supabase project dashboard
2. Settings → API
3. Update "Site URL" to your Render URL
4. Add your Render URL to "Additional Redirect URLs"

### 4.2 Set Up Production Database

1. Go to SQL Editor in Supabase
2. Run the `database-schema.sql` file
3. Verify all tables are created

## Step 5: Test Production Deployment

### 5.1 Basic Functionality Test

1. Visit your Render URL
2. Test the landing page loads
3. Check console for any errors

### 5.2 Stripe Webhook Test

1. Go to Stripe Dashboard → Webhooks
2. Click on your webhook endpoint
3. Click "Send test webhook"
4. Check Render logs for successful processing

### 5.3 Supabase Connection Test

1. Try to register a new user
2. Check Supabase Auth dashboard for new user
3. Verify database tables are populated

## Step 6: Custom Domain (Optional)

### 6.1 Add Custom Domain in Render

1. Go to your service settings
2. Click "Custom Domains"
3. Add your domain (e.g., `bluhatch.com`)
4. Follow DNS configuration instructions

### 6.2 Update Environment Variables

Update `NEXT_PUBLIC_APP_URL` to your custom domain

## Step 7: Monitoring and Maintenance

### 7.1 Render Monitoring

- Check Render dashboard for uptime
- Monitor build logs for errors
- Set up email alerts for failures

### 7.2 Stripe Monitoring

- Monitor webhook delivery in Stripe dashboard
- Check for failed webhook deliveries
- Set up Stripe alerts for payment failures

## Troubleshooting

### Common Issues:

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json
   - Check build logs for specific errors

2. **Webhook Failures**
   - Verify webhook URL is correct
   - Check webhook secret is properly set
   - Ensure webhook endpoint is accessible

3. **Database Connection Issues**
   - Verify Supabase environment variables
   - Check Supabase project is active
   - Verify database schema is properly set up

4. **Environment Variable Issues**
   - Double-check all variables are set in Render
   - Ensure no typos in variable names
   - Verify values match your Supabase/Stripe settings

### Getting Help:

- Check Render logs in the dashboard
- Review Stripe webhook logs
- Check Supabase logs for database issues
- Use browser developer tools for frontend issues

## Security Checklist

- [ ] All environment variables are set
- [ ] Stripe webhook secret is properly configured
- [ ] Supabase RLS policies are enabled
- [ ] HTTPS is enforced (automatic with Render)
- [ ] No sensitive data in client-side code
- [ ] Database credentials are secure

## Next Steps After Deployment

1. **Test all functionality** in production
2. **Set up monitoring** and alerts
3. **Configure backup strategies** for Supabase
4. **Plan for scaling** as user base grows
5. **Set up CI/CD** for automatic deployments

Your Bluhatch application will now be live and ready for production testing!
