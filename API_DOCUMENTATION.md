# Bluhatch API Documentation

## 🚀 Complete API Endpoints

### Authentication Endpoints

#### POST `/api/auth/register`

Register a new user account.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "companyName": "ABC Construction Ltd"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Account created successfully. Please check your email to verify your account.",
  "user": { ... }
}
```

#### POST `/api/auth/login`

Authenticate user login.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "user": { ... },
  "session": { ... }
}
```

#### POST `/api/auth/logout`

Logout current user.

**Response:**

```json
{
  "success": true,
  "message": "Logout successful"
}
```

#### POST `/api/auth/forgot-password`

Send password reset email.

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Password reset email sent successfully"
}
```

### Job Management Endpoints

#### GET `/api/jobs`

Get all jobs for the authenticated user.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "client_name": "John Smith",
      "client_address": "123 Main St",
      "job_type": "Plumbing",
      "protection_status": 75,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### POST `/api/jobs`

Create a new job.

**Request Body:**

```json
{
  "client_name": "John Smith",
  "client_address": "123 Main St",
  "client_phone": "+44123456789",
  "job_type": "Plumbing",
  "job_description": "Fix leaky tap",
  "contract_value": 150.0,
  "start_date": "2024-01-01"
}
```

#### GET `/api/jobs/[id]`

Get specific job details.

#### PUT `/api/jobs/[id]`

Update job information.

#### DELETE `/api/jobs/[id]`

Delete a job (only if no evidence captured).

### Evidence Capture Endpoints

#### POST `/api/evidence/upload`

Upload evidence file with GPS and blockchain timestamping.

**Request Body (FormData):**

```
file: File
job_id: string
evidence_type: 'before' | 'progress' | 'after' | 'defect' | 'approval'
description: string
gps_latitude?: number
gps_longitude?: number
gps_accuracy?: number
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "evidence_type": "before",
    "file_path": "https://...",
    "file_hash": "sha256hash",
    "blockchain_timestamp": "2024-01-01T00:00:00Z",
    "gps_latitude": 51.5074,
    "gps_longitude": -0.1278,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### GET `/api/evidence/[id]`

Get evidence item details.

#### POST `/api/evidence/[id]/verify`

Verify blockchain timestamp.

**Response:**

```json
{
  "success": true,
  "data": {
    "verified": true,
    "timestamp": "2024-01-01T00:00:00Z",
    "verifiedAt": "2024-01-01T00:00:00Z"
  }
}
```

#### GET `/api/jobs/[id]/evidence`

Get all evidence for a specific job.

### Client Approval Endpoints

#### POST `/api/approvals/signature`

Capture client signature for evidence approval.

**Request Body:**

```json
{
  "evidenceId": "uuid",
  "signature": "base64signature",
  "clientName": "John Smith"
}
```

#### POST `/api/approvals/photo`

Upload client approval photo.

**Request Body (FormData):**

```
file: File
job_id: string
client_name: string
```

#### GET `/api/approvals/[jobId]`

Get all approvals for a specific job.

### Report Generation Endpoints

#### POST `/api/jobs/[id]/report`

Generate dispute protection report.

**Response:**

```json
{
  "success": true,
  "data": {
    "reportUrl": "https://...",
    "reportId": "report-uuid",
    "generatedAt": "2024-01-01T00:00:00Z",
    "evidenceCount": 5,
    "protectionScore": 85
  }
}
```

#### GET `/api/reports/[id]`

Get generated report (HTML format).

### Subscription Management Endpoints

#### GET `/api/subscription/status`

Get user subscription status.

**Response:**

```json
{
  "success": true,
  "data": {
    "subscription_status": "active",
    "subscription_id": "sub_...",
    "subscription_details": {
      "status": "active",
      "current_period_end": "2024-02-01T00:00:00Z",
      "trial_end": "2024-01-08T00:00:00Z"
    }
  }
}
```

#### POST `/api/subscription/checkout`

Create Stripe checkout session.

**Response:**

```json
{
  "success": true,
  "data": {
    "session_id": "cs_...",
    "url": "https://checkout.stripe.com/..."
  }
}
```

#### POST `/api/subscription/create-portal`

Create Stripe customer portal session.

**Response:**

```json
{
  "success": true,
  "data": {
    "url": "https://billing.stripe.com/..."
  }
}
```

### Webhook Endpoints

#### POST `/api/webhooks/stripe`

Handle Stripe webhook events.

**Events Handled:**

- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `checkout.session.completed`

### Health Check

#### GET `/api/health`

Check system health and service status.

**Response:**

```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z",
  "services": {
    "database": "healthy",
    "stripe": "healthy",
    "environment": "healthy"
  }
}
```

## 🔧 Supabase Edge Functions

### Process Evidence

**Endpoint:** `https://your-project.supabase.co/functions/v1/process-evidence`

**Actions:**

- `timestamp` - Process blockchain timestamping
- `verify` - Verify file integrity
- `optimize` - Optimize image for storage

### Generate Report

**Endpoint:** `https://your-project.supabase.co/functions/v1/generate-report`

**Formats:**

- `html` - HTML report
- `pdf` - PDF report

## 🗄️ Database Schema

### Tables

#### `profiles`

- `id` (UUID, Primary Key)
- `company_name` (TEXT)
- `phone` (TEXT)
- `address` (TEXT)
- `subscription_status` (TEXT)
- `subscription_id` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### `jobs`

- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `client_name` (TEXT)
- `client_address` (TEXT)
- `client_phone` (TEXT)
- `job_type` (TEXT)
- `job_description` (TEXT)
- `contract_value` (DECIMAL)
- `start_date` (DATE)
- `completion_date` (DATE)
- `protection_status` (INTEGER)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### `evidence_items`

- `id` (UUID, Primary Key)
- `job_id` (UUID, Foreign Key)
- `evidence_type` (TEXT)
- `file_path` (TEXT)
- `file_hash` (TEXT)
- `blockchain_timestamp` (TEXT)
- `gps_latitude` (DECIMAL)
- `gps_longitude` (DECIMAL)
- `gps_accuracy` (DECIMAL)
- `device_timestamp` (TIMESTAMP)
- `server_timestamp` (TIMESTAMP)
- `description` (TEXT)
- `client_approval` (BOOLEAN)
- `client_signature` (TEXT)
- `created_at` (TIMESTAMP)

#### `reports`

- `id` (UUID, Primary Key)
- `job_id` (UUID, Foreign Key)
- `format` (TEXT)
- `content` (TEXT)
- `file_size` (INTEGER)
- `download_url` (TEXT)
- `generated_at` (TIMESTAMP)
- `created_at` (TIMESTAMP)

#### `audit_logs`

- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `job_id` (UUID, Foreign Key)
- `action` (TEXT)
- `details` (JSONB)
- `created_at` (TIMESTAMP)

## 🔒 Security Features

### Row Level Security (RLS)

All tables have RLS policies to ensure users can only access their own data.

### Authentication

- JWT-based authentication via Supabase Auth
- Session management with automatic refresh
- Password reset functionality

### File Security

- SHA-256 file hashing for integrity verification
- Secure file upload to Supabase Storage
- Public URL generation with access controls

### Blockchain Integration

- OpenTimestamps for tamper-proof timestamping
- Bitcoin blockchain anchoring
- Timestamp verification system

## 📱 Mobile-First Features

### PWA Support

- Service worker for offline functionality
- App manifest for installation
- Responsive design for all screen sizes

### GPS Integration

- Automatic location capture
- Accuracy reporting
- Location verification for evidence

### Camera Integration

- Webcam support for evidence capture
- Photo optimization
- Real-time preview

## 🚀 Deployment

### Environment Variables Required

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
STRIPE_SUBSCRIPTION_PRICE_ID=your_price_id
NEXT_PUBLIC_APP_URL=your_app_url
JWT_SECRET=your_jwt_secret
ENCRYPTION_KEY=your_encryption_key
```

### Backend Architecture

- **Next.js API Routes** - Serverless functions for API endpoints
- **Supabase Edge Functions** - For complex processing tasks
- **Supabase Database** - PostgreSQL with RLS
- **Supabase Storage** - File storage with encryption
- **Stripe** - Payment processing and subscriptions

This complete API provides full dispute protection functionality with legal compliance, blockchain timestamping, and professional report generation.
