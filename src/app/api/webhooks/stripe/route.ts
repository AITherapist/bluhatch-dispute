import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createServerClient } from '@/lib/supabase';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      console.error('Missing stripe-signature header');
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    console.log('Received Stripe webhook:', event.type);

    // Handle different event types
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event);
        break;
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event);
        break;
      case 'invoice.payment_failed':
        await handlePaymentFailed(event);
        break;
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleSubscriptionCreated(event: Stripe.Event) {
  const subscription = event.data.object;
  const customerId = subscription.customer;

  console.log('Subscription created:', subscription.id);

  // Update user subscription status in Supabase
  const supabase = createServerClient();

  const { error } = await supabase
    .from('profiles')
    .update({
      subscription_status: 'active',
      subscription_id: subscription.id,
      updated_at: new Date().toISOString(),
    })
    .eq('subscription_id', customerId);

  if (error) {
    console.error('Error updating subscription status:', error);
  }
}

async function handleSubscriptionUpdated(event: Stripe.Event) {
  const subscription = event.data.object;

  console.log('Subscription updated:', subscription.id);

  const supabase = createServerClient();

  let status = 'active';
  if (subscription.status === 'canceled') {
    status = 'cancelled';
  } else if (subscription.status === 'past_due') {
    status = 'past_due';
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      subscription_status: status,
      updated_at: new Date().toISOString(),
    })
    .eq('subscription_id', subscription.id);

  if (error) {
    console.error('Error updating subscription status:', error);
  }
}

async function handleSubscriptionDeleted(event: Stripe.Event) {
  const subscription = event.data.object;

  console.log('Subscription deleted:', subscription.id);

  const supabase = createServerClient();

  const { error } = await supabase
    .from('profiles')
    .update({
      subscription_status: 'cancelled',
      updated_at: new Date().toISOString(),
    })
    .eq('subscription_id', subscription.id);

  if (error) {
    console.error('Error updating subscription status:', error);
  }
}

async function handlePaymentSucceeded(event: Stripe.Event) {
  const invoice = event.data.object;

  console.log('Payment succeeded for invoice:', invoice.id);

  // Log successful payment
  const supabase = createServerClient();

  const { error } = await supabase.from('audit_logs').insert({
    action: 'payment_succeeded',
    details: {
      invoice_id: invoice.id,
      amount: invoice.amount_paid,
      currency: invoice.currency,
    },
  });

  if (error) {
    console.error('Error logging payment success:', error);
  }
}

async function handlePaymentFailed(event: Stripe.Event) {
  const invoice = event.data.object;

  console.log('Payment failed for invoice:', invoice.id);

  // Log failed payment
  const supabase = createServerClient();

  const { error } = await supabase.from('audit_logs').insert({
    action: 'payment_failed',
    details: {
      invoice_id: invoice.id,
      amount: invoice.amount_due,
      currency: invoice.currency,
    },
  });

  if (error) {
    console.error('Error logging payment failure:', error);
  }
}

async function handleCheckoutCompleted(event: Stripe.Event) {
  const session = event.data.object;

  console.log('Checkout completed:', session.id);

  // Update user subscription status
  const supabase = createServerClient();

  const { error } = await supabase
    .from('profiles')
    .update({
      subscription_status: 'active',
      subscription_id: session.subscription,
      updated_at: new Date().toISOString(),
    })
    .eq('id', session.metadata.user_id);

  if (error) {
    console.error('Error updating subscription after checkout:', error);
  }
}
