# Bluhatch Production Deployment Checklist

## Pre-Deployment Setup

### 1. Supabase Configuration

- [ ] Create Supabase project
- [ ] Run `database-schema.sql` in Supabase SQL Editor
- [ ] Get production URL and API keys
- [ ] Configure Row Level Security (RLS) policies
- [ ] Set up storage bucket for evidence files

### 2. Stripe Configuration

- [ ] Create Stripe account
- [ ] Get production API keys (live keys, not test)
- [ ] Create subscription product (£99/month)
- [ ] Set up webhook endpoint (will be configured after deployment)
- [ ] Test webhook with Stripe CLI (optional)

### 3. GitHub Repository

- [ ] Push code to GitHub repository
- [ ] Ensure all files are committed
- [ ] Verify .gitignore is working correctly

## Render Deployment Steps

### 4. Create Render Service

- [ ] Go to [render.com](https://render.com)
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub repository
- [ ] Select `bluhatch-dispute` repository

### 5. Configure Build Settings

- [ ] **Name**: `bluhatch-dispute`
- [ ] **Environment**: `Node`
- [ ] **Build Command**: `npm install && npm run build`
- [ ] **Start Command**: `npm start`
- [ ] **Node Version**: `18` (LTS)

### 6. Set Environment Variables

Add these variables in Render dashboard:

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

### 7. Deploy Application

- [ ] Click "Create Web Service"
- [ ] Wait for build to complete (5-10 minutes)
- [ ] Note the deployment URL

## Post-Deployment Configuration

### 8. Configure Stripe Webhooks

- [ ] Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
- [ ] Click "Add endpoint"
- [ ] **Endpoint URL**: `https://your-render-app.onrender.com/api/webhooks/stripe`
- [ ] **Description**: "Bluhatch Production Webhooks"
- [ ] **Events to send**:
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`
  - `checkout.session.completed`
- [ ] Copy webhook signing secret
- [ ] Update `STRIPE_WEBHOOK_SECRET` in Render environment variables

### 9. Update Supabase Settings

- [ ] Go to Supabase project settings
- [ ] **Site URL**: `https://your-render-app.onrender.com`
- [ ] **Additional Redirect URLs**: Add your Render URL
- [ ] Update any CORS settings if needed

### 10. Test Production Deployment

#### Basic Functionality

- [ ] Visit your Render URL
- [ ] Check landing page loads correctly
- [ ] Test responsive design on mobile
- [ ] Check browser console for errors

#### Health Check

- [ ] Visit `https://your-render-app.onrender.com/api/health`
- [ ] Verify all services show "healthy"
- [ ] Check database connection
- [ ] Check Stripe connection

#### Stripe Integration

- [ ] Test webhook delivery in Stripe dashboard
- [ ] Send test webhook from Stripe
- [ ] Check Render logs for webhook processing
- [ ] Verify no webhook failures

#### Supabase Integration

- [ ] Test user registration (if implemented)
- [ ] Check Supabase Auth dashboard
- [ ] Verify database tables are accessible
- [ ] Test file upload to Supabase Storage

## Production Monitoring

### 11. Set Up Monitoring

- [ ] Monitor Render dashboard for uptime
- [ ] Set up email alerts for build failures
- [ ] Monitor Stripe webhook delivery
- [ ] Check Supabase logs for errors

### 12. Security Checklist

- [ ] All environment variables are set
- [ ] No sensitive data in client-side code
- [ ] HTTPS is enforced (automatic with Render)
- [ ] Database credentials are secure
- [ ] Stripe webhook secret is properly configured

## Troubleshooting Common Issues

### Build Failures

- [ ] Check Node.js version compatibility
- [ ] Verify all dependencies are in package.json
- [ ] Check build logs for specific errors
- [ ] Ensure environment variables are set

### Webhook Issues

- [ ] Verify webhook URL is correct
- [ ] Check webhook secret matches
- [ ] Ensure webhook endpoint is accessible
- [ ] Test webhook with Stripe CLI

### Database Connection Issues

- [ ] Verify Supabase environment variables
- [ ] Check Supabase project is active
- [ ] Verify database schema is set up
- [ ] Check RLS policies are configured

### Performance Issues

- [ ] Monitor Render service metrics
- [ ] Check for memory leaks
- [ ] Optimize images and assets
- [ ] Consider upgrading Render plan if needed

## Final Verification

### 13. Complete Production Test

- [ ] Test user registration flow
- [ ] Test subscription checkout
- [ ] Test webhook processing
- [ ] Test database operations
- [ ] Test file uploads
- [ ] Test mobile responsiveness
- [ ] Test offline functionality (PWA)

### 14. Go Live Checklist

- [ ] All tests passing
- [ ] Monitoring set up
- [ ] Backup strategies in place
- [ ] Documentation updated
- [ ] Team notified
- [ ] Ready for users!

## Support Resources

- **Render Documentation**: https://render.com/docs
- **Stripe Webhooks**: https://stripe.com/docs/webhooks
- **Supabase Documentation**: https://supabase.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment

---

**Note**: Keep this checklist updated as you deploy and maintain your application. Each checkbox should be verified before moving to production.
