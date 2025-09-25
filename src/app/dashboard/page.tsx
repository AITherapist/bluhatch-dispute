'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import {
  Shield,
  CreditCard,
  Settings,
  LogOut,
  Plus,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

interface SubscriptionStatus {
  subscription_status: string;
  subscription_id: string | null;
  subscription_details: {
    id: string;
    status: string;
    current_period_end: string;
    cancel_at_period_end: boolean;
  } | null;
}

export default function DashboardPage() {
  const { user, profile, signOut, loading } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(
    null
  );
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchSubscriptionStatus();
    }
  }, [user]);

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await fetch('/api/subscription/status');
      const data = await response.json();

      if (data.success) {
        setSubscription(data.data);
      }
    } catch (error) {
      console.error('Error fetching subscription status:', error);
    } finally {
      setSubscriptionLoading(false);
    }
  };

  const handleSubscribe = async () => {
    try {
      const response = await fetch('/api/subscription/checkout', {
        method: 'POST',
      });
      const data = await response.json();

      if (data.success) {
        window.location.href = data.data.url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const response = await fetch('/api/subscription/create-portal', {
        method: 'POST',
      });
      const data = await response.json();

      if (data.success) {
        window.location.href = data.data.url;
      }
    } catch (error) {
      console.error('Error creating portal session:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isSubscribed = subscription?.subscription_status === 'active';
  const isPastDue = subscription?.subscription_status === 'past_due';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">
                Bluhatch
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {profile?.company_name || 'Your Company'}
              </span>
              <button
                onClick={signOut}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <LogOut className="mr-2 h-5 w-5" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {profile?.company_name || 'User'}!
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your dispute protection and subscription.
          </p>
        </div>

        {/* Subscription Status */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CreditCard className="mr-3 h-8 w-8 text-blue-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Subscription Status
                </h2>
                <p className="text-gray-600">
                  {subscriptionLoading
                    ? 'Loading...'
                    : isSubscribed
                      ? 'Active subscription'
                      : isPastDue
                        ? 'Payment past due'
                        : 'No active subscription'}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              {isSubscribed ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  <span className="font-medium">Active</span>
                </div>
              ) : isPastDue ? (
                <div className="flex items-center text-red-600">
                  <AlertCircle className="mr-2 h-5 w-5" />
                  <span className="font-medium">Past Due</span>
                </div>
              ) : (
                <div className="flex items-center text-gray-600">
                  <AlertCircle className="mr-2 h-5 w-5" />
                  <span className="font-medium">Inactive</span>
                </div>
              )}
            </div>
          </div>

          {subscription?.subscription_details && (
            <div className="mt-4 rounded-lg bg-gray-50 p-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-medium capitalize">
                    {subscription.subscription_details.status}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Next Billing</p>
                  <p className="font-medium">
                    {new Date(
                      subscription.subscription_details.current_period_end
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Auto-renewal</p>
                  <p className="font-medium">
                    {subscription.subscription_details.cancel_at_period_end
                      ? 'Cancelled'
                      : 'Active'}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flex space-x-4">
            {isSubscribed ? (
              <button
                onClick={handleManageSubscription}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              >
                Manage Subscription
              </button>
            ) : (
              <button
                onClick={handleSubscribe}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              >
                Subscribe Now - £99/month
              </button>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center">
              <Plus className="mr-3 h-8 w-8 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">New Job</h3>
            </div>
            <p className="mb-4 text-gray-600">
              Start documenting a new job for dispute protection.
            </p>
            <button
              disabled={!isSubscribed}
              className="w-full rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              Create New Job
            </button>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center">
              <Shield className="mr-3 h-8 w-8 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">My Jobs</h3>
            </div>
            <p className="mb-4 text-gray-600">
              View and manage your existing jobs.
            </p>
            <button
              disabled={!isSubscribed}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              View Jobs
            </button>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center">
              <Settings className="mr-3 h-8 w-8 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
            </div>
            <p className="mb-4 text-gray-600">
              Manage your account and preferences.
            </p>
            <button className="w-full rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700">
              Account Settings
            </button>
          </div>
        </div>

        {/* Subscription Required Notice */}
        {!isSubscribed && (
          <div className="mt-8 rounded-lg border border-yellow-200 bg-yellow-50 p-6">
            <div className="flex items-center">
              <AlertCircle className="mr-3 h-6 w-6 text-yellow-600" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-800">
                  Subscription Required
                </h3>
                <p className="text-yellow-700">
                  You need an active subscription to access job management and
                  evidence capture features.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
