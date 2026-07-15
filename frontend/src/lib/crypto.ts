/**
 * Securely hashes a string (like an email or phone number) using SHA-256.
 * This ensures raw PII is never stored in browser local storage.
 */
export async function generateSHA256Hash(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8); // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
  return hashHex;
}

/**
 * Helper to get the masked session ID (e.g., e3b0c4...abcd)
 */
export function getMaskedSessionId(hash: string | null): string {
  if (!hash || hash.length < 10) return "Anonymous Session";
  return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
}
