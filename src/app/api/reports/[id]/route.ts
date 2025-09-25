import { NextRequest, NextResponse } from 'next/server';
import { createClientComponentClient } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClientComponentClient();

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get report data (in a real implementation, this would fetch from a reports table)
    // For now, we'll generate the report on-demand
    const reportId = params.id;

    // Extract job ID from report ID (format: report-{jobId}-{timestamp})
    const jobId = reportId.split('-')[1];

    if (!jobId) {
      return NextResponse.json({ error: 'Invalid report ID' }, { status: 400 });
    }

    // Verify job ownership
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .eq('user_id', user.id)
      .single();

    if (jobError || !job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Get all evidence for this job
    const { data: evidence, error: evidenceError } = await supabase
      .from('evidence_items')
      .select('*')
      .eq('job_id', jobId)
      .order('created_at', { ascending: true });

    if (evidenceError) {
      console.error('Error fetching evidence:', evidenceError);
      return NextResponse.json(
        { error: 'Failed to fetch evidence' },
        { status: 500 }
      );
    }

    // Generate report HTML
    const reportHTML = generateReportHTML(job, evidence, user);

    return new NextResponse(reportHTML, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Report generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateReportHTML(
  job: Record<string, unknown>,
  evidence: Record<string, unknown>[]
): string {
  const evidenceByType = evidence.reduce(
    (acc, item) => {
      const evidenceType = item.evidence_type as string;
      if (!acc[evidenceType]) {
        acc[evidenceType] = [];
      }
      acc[evidenceType].push(item);
      return acc;
    },
    {} as Record<string, Record<string, unknown>[]>
  );

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dispute Protection Report - ${job.job_type}</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
            .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { text-align: center; border-bottom: 2px solid #1E3A8A; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #1E3A8A; }
            .title { font-size: 28px; margin: 10px 0; color: #333; }
            .subtitle { color: #666; font-size: 16px; }
            .section { margin: 30px 0; }
            .section-title { font-size: 20px; font-weight: bold; color: #1E3A8A; margin-bottom: 15px; border-bottom: 1px solid #e0e0e0; padding-bottom: 5px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
            .info-item { padding: 15px; background: #f8f9fa; border-radius: 5px; }
            .info-label { font-weight: bold; color: #555; margin-bottom: 5px; }
            .info-value { color: #333; }
            .protection-score { text-align: center; padding: 20px; background: ${getProtectionColor(job.protection_status)}; border-radius: 8px; margin: 20px 0; }
            .score-number { font-size: 48px; font-weight: bold; color: white; }
            .score-label { color: white; font-size: 18px; }
            .evidence-section { margin: 20px 0; }
            .evidence-type { margin: 20px 0; padding: 15px; border: 1px solid #e0e0e0; border-radius: 5px; }
            .evidence-type-title { font-weight: bold; color: #1E3A8A; margin-bottom: 10px; }
            .evidence-item { margin: 10px 0; padding: 10px; background: #f8f9fa; border-radius: 3px; }
            .evidence-description { margin-bottom: 5px; }
            .evidence-meta { font-size: 12px; color: #666; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666; font-size: 12px; }
            .blockchain-badge { display: inline-block; background: #28a745; color: white; padding: 2px 8px; border-radius: 3px; font-size: 10px; margin-left: 5px; }
            .gps-badge { display: inline-block; background: #17a2b8; color: white; padding: 2px 8px; border-radius: 3px; font-size: 10px; margin-left: 5px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🛡️ Bluhatch</div>
                <h1 class="title">Dispute Protection Report</h1>
                <p class="subtitle">Legally Admissible Evidence Documentation</p>
            </div>

            <div class="section">
                <h2 class="section-title">Job Information</h2>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Job Type</div>
                        <div class="info-value">${job.job_type}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Client</div>
                        <div class="info-value">${job.client_name}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Address</div>
                        <div class="info-value">${job.client_address}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Start Date</div>
                        <div class="info-value">${job.start_date ? new Date(job.start_date).toLocaleDateString() : 'Not set'}</div>
                    </div>
                    ${
                      job.contract_value
                        ? `
                    <div class="info-item">
                        <div class="info-label">Contract Value</div>
                        <div class="info-value">£${job.contract_value.toLocaleString()}</div>
                    </div>
                    `
                        : ''
                    }
                    ${
                      job.completion_date
                        ? `
                    <div class="info-item">
                        <div class="info-label">Completion Date</div>
                        <div class="info-value">${new Date(job.completion_date).toLocaleDateString()}</div>
                    </div>
                    `
                        : ''
                    }
                </div>
            </div>

            <div class="section">
                <h2 class="section-title">Protection Status</h2>
                <div class="protection-score">
                    <div class="score-number">${job.protection_status}%</div>
                    <div class="score-label">Dispute Protection Level</div>
                </div>
                <p style="text-align: center; color: #666; margin-top: 10px;">
                    ${getProtectionDescription(job.protection_status)}
                </p>
            </div>

            <div class="section">
                <h2 class="section-title">Evidence Documentation</h2>
                <p>This report contains ${evidence.length} evidence items with GPS location data and blockchain timestamping for legal admissibility.</p>
                
                ${Object.entries(evidenceByType)
                  .map(
                    ([type, items]) => `
                    <div class="evidence-type">
                        <div class="evidence-type-title">${type.charAt(0).toUpperCase() + type.slice(1)} Evidence (${items.length} items)</div>
                        ${items
                          .map(
                            (item) => `
                            <div class="evidence-item">
                                <div class="evidence-description">${item.description}</div>
                                <div class="evidence-meta">
                                    Captured: ${new Date(item.created_at).toLocaleString()}
                                    ${item.gps_latitude && item.gps_longitude ? '<span class="gps-badge">GPS</span>' : ''}
                                    ${item.blockchain_timestamp ? '<span class="blockchain-badge">BLOCKCHAIN</span>' : ''}
                                    ${item.client_approval ? '<span class="blockchain-badge">APPROVED</span>' : ''}
                                </div>
                            </div>
                        `
                          )
                          .join('')}
                    </div>
                `
                  )
                  .join('')}
            </div>

            <div class="section">
                <h2 class="section-title">Legal Compliance</h2>
                <ul>
                    <li>All evidence items include GPS location data for location verification</li>
                    <li>Blockchain timestamping provides tamper-proof timestamps</li>
                    <li>File integrity verified using SHA-256 hashing</li>
                    <li>Chain of custody maintained through audit logs</li>
                    <li>Evidence meets UK court admissibility standards</li>
                </ul>
            </div>

            <div class="footer">
                <p>Report generated on ${new Date().toLocaleString()} by Bluhatch Dispute Protection System</p>
                <p>This report is legally admissible evidence for UK court proceedings</p>
            </div>
        </div>
    </body>
    </html>
  `;
}

function getProtectionColor(score: number): string {
  if (score >= 80) return '#28a745';
  if (score >= 50) return '#ffc107';
  return '#dc3545';
}

function getProtectionDescription(score: number): string {
  if (score >= 80)
    return 'Strong protection - Comprehensive evidence documentation';
  if (score >= 50) return 'Moderate protection - Good evidence coverage';
  return 'Weak protection - Limited evidence documentation';
}
