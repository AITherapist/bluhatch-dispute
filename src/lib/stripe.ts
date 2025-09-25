import Stripe from 'stripe';

// Server-side Stripe instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
});

// Stripe configuration
export const STRIPE_CONFIG = {
  subscriptionPriceId:
    process.env.STRIPE_SUBSCRIPTION_PRICE_ID || 'price_1234567890', // Will be set in Supabase
  currency: 'gbp',
  subscriptionInterval: 'month',
  subscriptionAmount: 9900, // £99.00 in pence
} as const;

// Stripe webhook events we handle
export const STRIPE_WEBHOOK_EVENTS = [
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.payment_succeeded',
  'invoice.payment_failed',
] as const;
