'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Shield, ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function NewJobPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    client_name: '',
    client_address: '',
    client_phone: '',
    job_type: '',
    job_description: '',
    contract_value: '',
    start_date: new Date().toISOString().split('T')[0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

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
    router.push('/login');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/jobs/${data.data.id}`);
      } else {
        setError(data.error || 'Failed to create job');
      }
    } catch (error) {
      setError('Failed to create job');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-2xl font-bold text-gray-900">
              Bluhatch
            </span>
            <Link
              href="/jobs"
              className="ml-auto flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Jobs
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-8 shadow-sm">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create New Job</h1>
            <p className="mt-2 text-gray-600">
              Set up dispute protection for your new project
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Client Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Client Information
              </h2>

              <div>
                <label
                  htmlFor="client_name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Client Name *
                </label>
                <input
                  type="text"
                  id="client_name"
                  name="client_name"
                  required
                  value={formData.client_name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter client name"
                />
              </div>

              <div>
                <label
                  htmlFor="client_address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Client Address *
                </label>
                <textarea
                  id="client_address"
                  name="client_address"
                  required
                  rows={3}
                  value={formData.client_address}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter full client address"
                />
              </div>

              <div>
                <label
                  htmlFor="client_phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Client Phone
                </label>
                <input
                  type="tel"
                  id="client_phone"
                  name="client_phone"
                  value={formData.client_phone}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter client phone number"
                />
              </div>
            </div>

            {/* Job Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Job Information
              </h2>

              <div>
                <label
                  htmlFor="job_type"
                  className="block text-sm font-medium text-gray-700"
                >
                  Job Type *
                </label>
                <select
                  id="job_type"
                  name="job_type"
                  required
                  value={formData.job_type}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select job type</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Carpentry">Carpentry</option>
                  <option value="Painting">Painting</option>
                  <option value="Roofing">Roofing</option>
                  <option value="Flooring">Flooring</option>
                  <option value="Kitchen Installation">
                    Kitchen Installation
                  </option>
                  <option value="Bathroom Renovation">
                    Bathroom Renovation
                  </option>
                  <option value="General Construction">
                    General Construction
                  </option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="job_description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Job Description
                </label>
                <textarea
                  id="job_description"
                  name="job_description"
                  rows={4}
                  value={formData.job_description}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Describe the work to be performed"
                />
              </div>

              <div>
                <label
                  htmlFor="contract_value"
                  className="block text-sm font-medium text-gray-700"
                >
                  Contract Value (£)
                </label>
                <input
                  type="number"
                  id="contract_value"
                  name="contract_value"
                  min="0"
                  step="0.01"
                  value={formData.contract_value}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter contract value"
                />
              </div>

              <div>
                <label
                  htmlFor="start_date"
                  className="block text-sm font-medium text-gray-700"
                >
                  Start Date
                </label>
                <input
                  type="date"
                  id="start_date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-600">
                {error}
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <Link
                href="/jobs"
                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save className="mr-2 h-5 w-5" />
                {isSubmitting ? 'Creating...' : 'Create Job'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
