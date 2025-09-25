# Bluhatch Development Specification

## 🎯 Project Overview

**Bluhatch** is a mobile-first Progressive Web App (PWA) designed exclusively for trade dispute protection. The platform captures legally admissible evidence and generates comprehensive dispute protection reports for tradespeople.

### Core Mission

Create bulletproof, court-admissible documentation that protects tradespeople from payment disputes and quality claims.

---

## 🛠️ Technology Stack

### Frontend & Framework

- **Next.js 14** (App Router) - React framework for production-ready PWAs
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling for rapid UI development
- **PWA Configuration** - Service workers for offline functionality

### Backend & Database

- **Supabase** - Backend-as-a-Service providing:
  - PostgreSQL database
  - Real-time subscriptions
  - Row Level Security (RLS)
  - Authentication
  - File storage with encryption
  - Edge Functions (serverless)

### Payments & Subscriptions

- **Stripe** - Payment processing and subscription management
- **Stripe Customer Portal** - Self-service billing management

### Blockchain & Evidence Integrity

- **OpenTimestamps** - Free, open-source blockchain timestamping
- **Bitcoin Blockchain** - Decentralized timestamp anchoring
- **SHA-256 Hashing** - Cryptographic file integrity

### Deployment & Infrastructure

- **Render** - Cloud platform for deployment
- **Environment Variables** - Secure configuration management
- **CI/CD** - Automated deployment pipeline

---

## 📊 Database Schema

### Core Tables

#### `users` (Supabase Auth)

```sql
- id (uuid, primary key)
- email (text, unique)
- created_at (timestamp)
- updated_at (timestamp)
```

#### `profiles`

```sql
- id (uuid, primary key, references users.id)
- company_name (text)
- phone (text)
- address (text)
- subscription_status (text) -- 'active', 'cancelled', 'past_due'
- subscription_id (text) -- Stripe subscription ID
- created_at (timestamp)
- updated_at (timestamp)
```

#### `jobs`

```sql
- id (uuid, primary key)
- user_id (uuid, references profiles.id)
- client_name (text, not null)
- client_address (text, not null)
- client_phone (text)
- job_type (text, not null) -- 'plumbing', 'electrical', 'construction', etc.
- job_description (text)
- contract_value (decimal)
- start_date (date)
- completion_date (date)
- protection_status (integer) -- 0-100 percentage
- created_at (timestamp)
- updated_at (timestamp)
```

#### `evidence_items`

```sql
- id (uuid, primary key)
- job_id (uuid, references jobs.id)
- evidence_type (text) -- 'before', 'progress', 'after', 'defect', 'approval'
- file_path (text) -- Supabase Storage path
- file_hash (text) -- SHA-256 hash
- blockchain_timestamp (text) -- OpenTimestamps proof
- gps_latitude (decimal)
- gps_longitude (decimal)
- gps_accuracy (decimal)
- device_timestamp (timestamp)
- server_timestamp (timestamp)
- description (text, not null)
- client_approval (boolean, default false)
- client_signature (text) -- Base64 encoded signature
- created_at (timestamp)
```

#### `audit_logs`

```sql
- id (uuid, primary key)
- user_id (uuid, references profiles.id)
- job_id (uuid, references jobs.id)
- action (text) -- 'evidence_captured', 'report_generated', 'client_approved'
- details (jsonb)
- ip_address (text)
- user_agent (text)
- created_at (timestamp)
```

---

## 🔐 Security & Legal Compliance

### Evidence Integrity Requirements (NON-NEGOTIABLE)

#### Photo Capture Standards

- **Minimum Resolution:** 8MP
- **Metadata Preservation:** EXIF data must remain intact
- **No Editing Allowed:** Images cannot be modified after capture
- **GPS Embedding:** Precise coordinates embedded in EXIF
- **Server Timestamps:** All timestamps verified by server, not device

#### Blockchain Timestamping Process

1. Generate SHA-256 hash of original file
2. Submit hash to OpenTimestamps calendar servers
3. Wait for Bitcoin blockchain confirmation
4. Store timestamp proof in database
5. Provide verification mechanism for users

#### Data Encryption

- **At Rest:** AES-256 encryption for all stored files
- **In Transit:** TLS 1.3 for all API communications
- **Key Management:** Supabase handles encryption keys

### Legal Disclaimers & Compliance

#### In-App Disclaimers

```
EVIDENCE DISCLAIMER:
"Evidence must be captured truthfully and completely. Bluhatch does not alter or verify factual accuracy of descriptions or photos. Users are solely responsible for entering correct context."

REPORT DISCLAIMER:
"This report was automatically generated using the Bluhatch platform. All descriptions and evidence are user-supplied. Bluhatch does not provide legal advice and cannot guarantee admissibility in every court or tribunal."

SIGNATURE DISCLAIMER:
"This digital signature represents the client's acknowledgement as entered at the time of capture. Users are responsible for ensuring authenticity of consent."
```

#### GDPR Compliance

- **Data Processing Agreement:** Required with Supabase
- **Data Retention:** 7 years for legal evidence
- **User Rights:** Download, delete, portability
- **Breach Notification:** 72-hour ICO notification process

---

## 🚀 API Endpoints

### Authentication Endpoints

```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

### Job Management

```
GET /api/jobs - List user's jobs
POST /api/jobs - Create new job
GET /api/jobs/[id] - Get job details
PUT /api/jobs/[id] - Update job
DELETE /api/jobs/[id] - Delete job (if no evidence captured)
```

### Evidence Capture

```
POST /api/evidence/upload - Upload evidence file
POST /api/evidence/timestamp - Create blockchain timestamp
GET /api/evidence/[id] - Get evidence details
POST /api/evidence/[id]/verify - Verify blockchain timestamp
```

### Client Approvals

```
POST /api/approvals/signature - Capture client signature
POST /api/approvals/photo - Upload approval photo
GET /api/approvals/[jobId] - Get job approvals
```

### Report Generation

```
POST /api/reports/generate - Generate dispute protection report
GET /api/reports/[id] - Download report
GET /api/reports/[id]/verify - Verify report integrity
```

### Subscription Management

```
GET /api/subscription/status - Get subscription status
POST /api/subscription/create-portal - Create Stripe customer portal
POST /api/webhooks/stripe - Handle Stripe webhooks
```

---

## 📱 Core User Flows

### 1. User Onboarding

1. User visits app
2. Registration with email/password
3. Email verification
4. Stripe checkout for £99/month subscription
5. Profile setup (company details)
6. First job creation

### 2. Job Documentation Workflow

1. **Job Setup:**
   - Enter client details (name, address, phone)
   - Select job type and description
   - Set contract value and start date

2. **Before Work Documentation:**
   - Capture "before" photos with GPS
   - Add detailed descriptions
   - Upload signed contract
   - Generate blockchain timestamps

3. **Progress Documentation:**
   - Daily progress photos with descriptions
   - Client approval signatures
   - Material receipts and documentation
   - Issue documentation if problems arise

4. **Completion Documentation:**
   - Final "after" photos
   - Client sign-off and satisfaction
   - Generate comprehensive legal report
   - Archive job with full protection status

### 3. Evidence Capture Process

1. Open camera interface
2. Capture high-resolution photo
3. Automatic GPS location embedding
4. Add evidence description (mandatory)
5. Select evidence type (before/progress/after/defect/approval)
6. Server timestamp generation
7. Blockchain timestamping (background process)
8. Secure cloud storage
9. Update job protection status

---

## 🎨 UI/UX Design Principles

### Mobile-First Design

- **One-handed operation** - Tradespeople often have dirty hands
- **Large tap targets** - Work gloves compatibility
- **Clear visual hierarchy** - Evidence status immediately visible
- **Professional aesthetic** - Builds client confidence

### Key Interface Elements

- **Protection Status Indicator:** Visual percentage (0-100%) of job protection
- **Quick Evidence Capture:** Floating action button accessible from all screens
- **Evidence Timeline:** Chronological display of all documentation
- **Legal Report Preview:** Show report before final generation

### Color Scheme

- **Primary Blue (#1E3A8A):** Trust, legal protection, professionalism
- **Protection Green (#10B981):** Complete documentation, safety
- **Warning Orange (#F59E0B):** Missing documentation, action required
- **Error Red (#DC2626):** Critical issues, disputes

---

## 🔧 Technical Requirements

### Performance Standards

- **Photo Capture & Save:** < 2 seconds
- **Report Generation:** < 30 seconds
- **Offline Capability:** Core documentation works without internet
- **Uptime:** 99.9% for evidence storage

### Browser Compatibility

- **Chrome/Edge:** Full PWA support
- **Safari:** iOS compatibility
- **Firefox:** Basic functionality
- **Mobile Browsers:** Optimized for mobile devices

### File Handling

- **Maximum File Size:** 50MB per photo
- **Supported Formats:** JPEG, PNG, PDF
- **Compression:** Automatic optimization for web delivery
- **Backup:** Multiple copies across Supabase regions

---

## 📋 Development Phases

### Phase 0: Project Foundation (Week 1)

- [ ] Initialize Next.js project with TypeScript
- [ ] Configure ESLint, Prettier, Husky
- [ ] Set up Supabase project and database
- [ ] Configure environment variables
- [ ] Create basic project structure

### Phase 1: Authentication & Payments (Week 2)

- [ ] Implement Supabase Auth
- [ ] Create user registration/login flows
- [ ] Integrate Stripe subscriptions
- [ ] Set up Stripe webhooks
- [ ] Create subscription management UI

### Phase 2: Core Evidence Capture (Week 3-4)

- [ ] Build job management interface
- [ ] Implement WebRTC camera capture
- [ ] Add GPS location services
- [ ] Create evidence upload system
- [ ] Build evidence timeline view

### Phase 3: Legal Enhancements (Week 5-6)

- [ ] Integrate OpenTimestamps
- [ ] Add digital signature capture
- [ ] Build PDF report generation
- [ ] Implement audit logging
- [ ] Create report download system

### Phase 4: Polish & Deployment (Week 7-8)

- [ ] Add offline capability
- [ ] Implement service workers
- [ ] UI/UX refinement
- [ ] Comprehensive testing
- [ ] Deploy to Render
- [ ] Performance optimization

---

## 🧪 Testing Strategy

### Unit Tests

- Evidence capture functions
- Timestamp generation
- File upload validation
- GPS coordinate handling

### Integration Tests

- Stripe webhook processing
- Supabase storage operations
- OpenTimestamps integration
- Report generation pipeline

### End-to-End Tests

- Complete user registration flow
- Evidence capture workflow
- Report generation and download
- Subscription management

### Legal Compliance Tests

- Evidence integrity verification
- Blockchain timestamp validation
- GDPR compliance checks
- Data retention policies

---

## 🚨 Critical Success Factors

### Evidence Integrity (NON-NEGOTIABLE)

- Original files with metadata intact
- Tamper-proof timestamps
- Blockchain verification
- No editing capabilities
- Chain of custody documentation

### User Experience

- Simple, intuitive interface
- Fast, reliable performance
- Offline functionality
- Professional output quality

### Legal Compliance

- UK evidence standards compliance
- GDPR compliance
- Data security and privacy
- Professional legal disclaimers

---

## 📞 Support & Maintenance

### Monitoring

- Application performance metrics
- Error tracking and logging
- User activity analytics
- Security incident monitoring

### Backup & Recovery

- Daily database backups
- File storage redundancy
- Disaster recovery procedures
- Data migration capabilities

### Updates & Maintenance

- Regular security updates
- Feature enhancements
- Performance optimizations
- Legal compliance updates

---

## 🎯 Success Metrics

### Primary KPIs

- **Evidence Quality Score:** Metadata integrity, timestamp accuracy
- **Protection Coverage:** Percentage of jobs with complete documentation
- **Report Generation:** Number of legal reports created
- **User Retention:** Monthly active documentation sessions

### Legal Effectiveness

- Dispute resolution success rate
- Insurance claim approval rates
- Court case outcomes (when applicable)
- User satisfaction with evidence quality

---

_This specification serves as the single source of truth for Bluhatch development. All features, APIs, and requirements are defined here to ensure consistent, production-ready implementation._
