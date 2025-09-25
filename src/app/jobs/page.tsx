'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Job } from '@/types';
import {
  Shield,
  Plus,
  Calendar,
  MapPin,
  Phone,
  PoundSterling,
  Edit,
  Trash2,
  Eye,
} from 'lucide-react';
import Link from 'next/link';

export default function JobsPage() {
  const { user, loading } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchJobs();
    }
  }, [user]);

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs');
      const data = await response.json();

      if (data.success) {
        setJobs(data.data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setJobsLoading(false);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job?')) {
      return;
    }

    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setJobs(jobs.filter((job) => job.id !== jobId));
      }
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  if (loading || jobsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">
                Bluhatch
              </span>
            </div>
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-gray-900"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Jobs</h1>
              <p className="mt-2 text-gray-600">
                Manage your dispute protection jobs
              </p>
            </div>
            <Link
              href="/jobs/new"
              className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              <Plus className="mr-2 h-5 w-5" />
              New Job
            </Link>
          </div>
        </div>

        {/* Jobs Grid */}
        {jobs.length === 0 ? (
          <div className="rounded-lg bg-white p-12 text-center shadow-sm">
            <Shield className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              No jobs yet
            </h3>
            <p className="mt-2 text-gray-600">
              Get started by creating your first job for dispute protection.
            </p>
            <Link
              href="/jobs/new"
              className="mt-4 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Your First Job
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <div key={job.id} className="rounded-lg bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {job.job_type}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {job.client_name}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      href={`/jobs/${job.id}`}
                      className="text-gray-400 hover:text-blue-600"
                    >
                      <Eye className="h-5 w-5" />
                    </Link>
                    <Link
                      href={`/jobs/${job.id}/edit`}
                      className="text-gray-400 hover:text-blue-600"
                    >
                      <Edit className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="mr-2 h-4 w-4" />
                    <span className="truncate">{job.client_address}</span>
                  </div>

                  {job.client_phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="mr-2 h-4 w-4" />
                      <span>{job.client_phone}</span>
                    </div>
                  )}

                  {job.contract_value && (
                    <div className="flex items-center text-sm text-gray-600">
                      <PoundSterling className="mr-2 h-4 w-4" />
                      <span>£{job.contract_value.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>
                      {job.start_date
                        ? new Date(job.start_date).toLocaleDateString()
                        : 'Not set'}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Protection Status
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {job.protection_status}%
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-blue-600"
                      style={{ width: `${job.protection_status}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
