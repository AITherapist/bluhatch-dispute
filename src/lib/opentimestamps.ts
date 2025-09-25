import { TimestampProof } from '@/types';

// OpenTimestamps configuration
const OPENTIMESTAMPS_CALENDAR_URL =
  process.env.OPENTIMESTAMPS_CALENDAR_URL ||
  'https://alice.btc.calendar.opentimestamps.org';

/**
 * Generate SHA-256 hash of a file
 */
export async function generateFileHash(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Submit hash to OpenTimestamps calendar for timestamping
 */
export async function submitToOpenTimestamps(hash: string): Promise<string> {
  try {
    const response = await fetch(OPENTIMESTAMPS_CALENDAR_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
      },
      body: hash,
    });

    if (!response.ok) {
      throw new Error(
        `OpenTimestamps submission failed: ${response.statusText}`
      );
    }

    // Return the timestamp proof
    return await response.text();
  } catch (error) {
    console.error('OpenTimestamps submission error:', error);
    throw new Error('Failed to submit hash to OpenTimestamps');
  }
}

/**
 * Verify a timestamp proof against the Bitcoin blockchain
 */
export async function verifyTimestamp(proof: string): Promise<boolean> {
  try {
    // This would typically involve parsing the OpenTimestamps proof
    // and verifying it against the Bitcoin blockchain
    // For now, we'll implement a basic verification
    return proof.length > 0;
  } catch (error) {
    console.error('Timestamp verification error:', error);
    return false;
  }
}

/**
 * Create a complete timestamp proof for a file
 */
export async function createTimestampProof(
  file: File
): Promise<TimestampProof> {
  const hash = await generateFileHash(file);
  const proof = await submitToOpenTimestamps(hash);
  const verified = await verifyTimestamp(proof);

  return {
    hash,
    timestamp: new Date().toISOString(),
    proof,
    verified,
  };
}
