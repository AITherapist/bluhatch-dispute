'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Job, EvidenceItem } from '@/types';
import {
  Shield,
  ArrowLeft,
  Camera,
  MapPin,
  Phone,
  PoundSterling,
  Calendar,
  Plus,
  Eye,
  Download,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

interface JobDetailPageProps {
  params: { id: string };
}

export default function JobDetailPage({ params }: JobDetailPageProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
  const [jobLoading, setJobLoading] = useState(true);
  const [evidenceLoading, setEvidenceLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const fetchJob = useCallback(async () => {
    try {
      const response = await fetch(`/api/jobs/${params.id}`);
      const data = await response.json();

      if (data.success) {
        setJob(data.data);
      } else {
        router.push('/jobs');
      }
    } catch (error) {
      console.error('Error fetching job:', error);
      router.push('/jobs');
    } finally {
      setJobLoading(false);
    }
  }, [params.id, router]);

  const fetchEvidence = useCallback(async () => {
    try {
      const response = await fetch(`/api/jobs/${params.id}/evidence`);
      const data = await response.json();

      if (data.success) {
        setEvidence(data.data);
      }
    } catch (error) {
      console.error('Error fetching evidence:', error);
    } finally {
      setEvidenceLoading(false);
    }
  }, [params.id]);

  const handleGenerateReport = async () => {
    try {
      const response = await fetch(`/api/jobs/${params.id}/report`, {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        // Open report in new tab
        window.open(data.data.reportUrl, '_blank');
      } else {
        alert('Failed to generate report: ' + data.error);
      }
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report');
    }
  };

  useEffect(() => {
    if (user && params.id) {
      fetchJob();
      fetchEvidence();
    }
  }, [user, params.id, fetchJob, fetchEvidence]);

  if (loading || jobLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading job...</p>
        </div>
      </div>
    );
  }

  if (!user || !job) {
    return null;
  }

  const getProtectionStatusColor = (status: number) => {
    if (status >= 80) return 'text-green-600';
    if (status >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProtectionStatusBg = (status: number) => {
    if (status >= 80) return 'bg-green-600';
    if (status >= 50) return 'bg-yellow-600';
    return 'bg-red-600';
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

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Job Header */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {job.job_type}
              </h1>
              <p className="mt-2 text-lg text-gray-600">{job.client_name}</p>
              <p className="mt-1 text-gray-500">{job.client_address}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Protection Status</div>
              <div
                className={`text-2xl font-bold ${getProtectionStatusColor(job.protection_status)}`}
              >
                {job.protection_status}%
              </div>
              <div className="mt-2 h-2 w-32 rounded-full bg-gray-200">
                <div
                  className={`h-2 rounded-full ${getProtectionStatusBg(job.protection_status)}`}
                  style={{ width: `${job.protection_status}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Job Details */}
          <div className="lg:col-span-2">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                Job Details
              </h2>

              <div className="space-y-4">
                <div className="flex items-center">
                  <MapPin className="mr-3 h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Address</div>
                    <div className="font-medium">{job.client_address}</div>
                  </div>
                </div>

                {job.client_phone && (
                  <div className="flex items-center">
                    <Phone className="mr-3 h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Phone</div>
                      <div className="font-medium">{job.client_phone}</div>
                    </div>
                  </div>
                )}

                {job.contract_value && (
                  <div className="flex items-center">
                    <PoundSterling className="mr-3 h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">
                        Contract Value
                      </div>
                      <div className="font-medium">
                        £{job.contract_value.toLocaleString()}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center">
                  <Calendar className="mr-3 h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Start Date</div>
                    <div className="font-medium">
                      {job.start_date
                        ? new Date(job.start_date).toLocaleDateString()
                        : 'Not set'}
                    </div>
                  </div>
                </div>

                {job.completion_date && (
                  <div className="flex items-center">
                    <CheckCircle className="mr-3 h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">
                        Completion Date
                      </div>
                      <div className="font-medium">
                        {new Date(job.completion_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {job.job_description && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-600">
                    Description
                  </h3>
                  <p className="mt-2 text-gray-900">{job.job_description}</p>
                </div>
              )}
            </div>

            {/* Evidence Section */}
            <div className="mt-8 rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Evidence
                </h2>
                <Link
                  href={`/jobs/${job.id}/evidence/new`}
                  className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Add Evidence
                </Link>
              </div>

              {evidenceLoading ? (
                <div className="py-8 text-center">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-gray-600">Loading evidence...</p>
                </div>
              ) : evidence.length === 0 ? (
                <div className="py-8 text-center">
                  <Camera className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">
                    No evidence yet
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Start documenting your work to build dispute protection.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {evidence.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-lg border border-gray-200 p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                              {item.evidence_type}
                            </span>
                            {item.blockchain_timestamp && (
                              <CheckCircle className="ml-2 h-4 w-4 text-green-600" />
                            )}
                          </div>
                          <p className="mt-2 text-sm text-gray-900">
                            {item.description}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {new Date(item.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-gray-400 hover:text-blue-600">
                            <Eye className="h-5 w-5" />
                          </button>
                          <button className="text-gray-400 hover:text-green-600">
                            <Download className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Protection Status */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Protection Status
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Current Level</span>
                    <span
                      className={getProtectionStatusColor(
                        job.protection_status
                      )}
                    >
                      {job.protection_status}%
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                    <div
                      className={`h-2 rounded-full ${getProtectionStatusBg(job.protection_status)}`}
                      style={{ width: `${job.protection_status}%` }}
                    ></div>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  {job.protection_status >= 80 ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Strong protection
                    </div>
                  ) : job.protection_status >= 50 ? (
                    <div className="flex items-center text-yellow-600">
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Moderate protection
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600">
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Weak protection
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Quick Actions
              </h3>

              <div className="space-y-3">
                <Link
                  href={`/jobs/${job.id}/evidence/new`}
                  className="flex w-full items-center rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  <Camera className="mr-3 h-5 w-5" />
                  Capture Evidence
                </Link>

                <Link
                  href={`/jobs/${job.id}/edit`}
                  className="flex w-full items-center rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  <Shield className="mr-3 h-5 w-5" />
                  Edit Job
                </Link>

                <button
                  onClick={handleGenerateReport}
                  className="flex w-full items-center rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  <Download className="mr-3 h-5 w-5" />
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
