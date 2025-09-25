'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Shield, ArrowLeft, Camera, MapPin, Save } from 'lucide-react';
import Link from 'next/link';
import Webcam from 'react-webcam';

interface EvidenceCapturePageProps {
  params: { id: string };
}

export default function EvidenceCapturePage({
  params,
}: EvidenceCapturePageProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const webcamRef = useRef<Webcam>(null);

  const [evidenceType, setEvidenceType] = useState<
    'before' | 'progress' | 'after' | 'defect' | 'approval'
  >('before');
  const [description, setDescription] = useState('');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [gpsLocation, setGpsLocation] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number;
  } | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const capturePhoto = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      setIsCapturing(false);
    }
  }, []);

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

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGpsLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setError(
            'Unable to get GPS location. Please enable location services.'
          );
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!capturedImage) {
      setError('Please capture a photo first');
      setIsSubmitting(false);
      return;
    }

    try {
      // Convert base64 image to blob
      const response = await fetch(capturedImage);
      const blob = await response.blob();

      // Create form data
      const formData = new FormData();
      formData.append('file', blob, 'evidence.jpg');
      formData.append('evidence_type', evidenceType);
      formData.append('description', description);

      if (gpsLocation) {
        formData.append('gps_latitude', gpsLocation.latitude.toString());
        formData.append('gps_longitude', gpsLocation.longitude.toString());
        formData.append('gps_accuracy', gpsLocation.accuracy.toString());
      }

      // Upload file and create evidence
      const uploadResponse = await fetch(
        `/api/jobs/${params.id}/evidence/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await uploadResponse.json();

      if (data.success) {
        router.push(`/jobs/${params.id}`);
      } else {
        setError(data.error || 'Failed to save evidence');
      }
    } catch (error) {
      console.error('Error submitting evidence:', error);
      setError('Failed to save evidence');
    } finally {
      setIsSubmitting(false);
    }
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
              href={`/jobs/${params.id}`}
              className="ml-auto flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Job
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-8 shadow-sm">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Capture Evidence
            </h1>
            <p className="mt-2 text-gray-600">
              Document your work with GPS location and blockchain timestamping
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Evidence Type Selection */}
            <div>
              <label className="mb-4 block text-sm font-medium text-gray-700">
                Evidence Type *
              </label>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                {[
                  {
                    value: 'before',
                    label: 'Before',
                    color: 'bg-red-100 text-red-800',
                  },
                  {
                    value: 'progress',
                    label: 'Progress',
                    color: 'bg-yellow-100 text-yellow-800',
                  },
                  {
                    value: 'after',
                    label: 'After',
                    color: 'bg-green-100 text-green-800',
                  },
                  {
                    value: 'defect',
                    label: 'Defect',
                    color: 'bg-orange-100 text-orange-800',
                  },
                  {
                    value: 'approval',
                    label: 'Approval',
                    color: 'bg-blue-100 text-blue-800',
                  },
                ].map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() =>
                      setEvidenceType(
                        type.value as
                          | 'before'
                          | 'progress'
                          | 'after'
                          | 'defect'
                          | 'approval'
                      )
                    }
                    className={`rounded-lg border-2 p-4 text-center transition-colors ${
                      evidenceType === type.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${type.color}`}
                    >
                      {type.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description *
              </label>
              <textarea
                id="description"
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Describe what you're documenting..."
              />
            </div>

            {/* Camera Section */}
            <div>
              <label className="mb-4 block text-sm font-medium text-gray-700">
                Photo *
              </label>

              {!isCapturing && !capturedImage && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setIsCapturing(true)}
                    className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  >
                    <Camera className="mr-2 h-5 w-5" />
                    Start Camera
                  </button>
                </div>
              )}

              {isCapturing && (
                <div className="space-y-4">
                  <div className="relative">
                    <Webcam
                      ref={webcamRef}
                      audio={false}
                      screenshotFormat="image/jpeg"
                      className="w-full rounded-lg"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="flex items-center rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                    >
                      <Camera className="mr-2 h-5 w-5" />
                      Capture Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsCapturing(false)}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {capturedImage && (
                <div className="space-y-4">
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={capturedImage}
                      alt="Captured evidence"
                      className="w-full rounded-lg"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => {
                        setCapturedImage(null);
                        setIsCapturing(true);
                      }}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      Retake Photo
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* GPS Location */}
            <div>
              <label className="mb-4 block text-sm font-medium text-gray-700">
                GPS Location
              </label>

              {!gpsLocation ? (
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="flex items-center rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  <MapPin className="mr-2 h-5 w-5" />
                  Get Current Location
                </button>
              ) : (
                <div className="rounded-lg bg-green-50 p-4">
                  <div className="flex items-center text-green-800">
                    <MapPin className="mr-2 h-5 w-5" />
                    <span className="font-medium">Location Captured</span>
                  </div>
                  <p className="mt-1 text-sm text-green-700">
                    Lat: {gpsLocation.latitude.toFixed(6)}, Lng:{' '}
                    {gpsLocation.longitude.toFixed(6)}
                    <br />
                    Accuracy: ±{Math.round(gpsLocation.accuracy)}m
                  </p>
                </div>
              )}
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-600">
                {error}
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <Link
                href={`/jobs/${params.id}`}
                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting || !capturedImage}
                className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save className="mr-2 h-5 w-5" />
                {isSubmitting ? 'Saving...' : 'Save Evidence'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
