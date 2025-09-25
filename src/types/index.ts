// Core database types based on our schema
export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  company_name?: string;
  phone?: string;
  address?: string;
  subscription_status: 'active' | 'cancelled' | 'past_due' | 'trialing';
  subscription_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  user_id: string;
  client_name: string;
  client_address: string;
  client_phone?: string;
  job_type: string;
  job_description?: string;
  contract_value?: number;
  start_date?: string;
  completion_date?: string;
  protection_status: number; // 0-100 percentage
  created_at: string;
  updated_at: string;
}

export interface EvidenceItem {
  id: string;
  job_id: string;
  evidence_type: 'before' | 'progress' | 'after' | 'defect' | 'approval';
  file_path: string;
  file_hash: string;
  blockchain_timestamp?: string;
  gps_latitude?: number;
  gps_longitude?: number;
  gps_accuracy?: number;
  device_timestamp: string;
  server_timestamp: string;
  description: string;
  client_approval: boolean;
  client_signature?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  job_id?: string;
  action: string;
  details: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Evidence capture types
export interface EvidenceCaptureData {
  jobId: string;
  evidenceType: EvidenceItem['evidence_type'];
  description: string;
  file: File;
  gpsCoordinates?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
}

// Report generation types
export interface DisputeProtectionReport {
  id: string;
  jobId: string;
  generatedAt: string;
  reportUrl: string;
  evidenceCount: number;
  protectionScore: number;
}

// Stripe types
export interface SubscriptionStatus {
  status: 'active' | 'cancelled' | 'past_due' | 'incomplete' | 'trialing';
  current_period_end: string;
  cancel_at_period_end: boolean;
  trial_start?: string;
  trial_end?: string;
}

// OpenTimestamps types
export interface TimestampProof {
  hash: string;
  timestamp: string;
  proof: string;
  verified: boolean;
}
