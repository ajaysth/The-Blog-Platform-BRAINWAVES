// lib/uploadcare.ts

type UploadResponse = {
  file: string;
  original_filename: string;
  size: number;
  mime_type: string;
};

type UploadcareConfig = {
  publicKey: string;
  store?: 'auto' | '0' | '1';
  cdnDomain?: string; // Add support for custom CDN domain
};

// Your custom CDN domain - update this to match your actual domain
const UPLOADCARE_CDN_DOMAIN = process.env.NEXT_PUBLIC_UPLOADCARE_CDN_DOMAIN || 'https://2l9nx4euxr.ucarecd.net';

/**
 * Upload a file to Uploadcare CDN
 * @param file - The file to upload
 * @param config - Uploadcare configuration
 * @returns The CDN URL of the uploaded file
 */
export async function uploadToUploadcare(
  file: File,
  config?: Partial<UploadcareConfig>
): Promise<string> {
  const publicKey = config?.publicKey || process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY;
  
  if (!publicKey) {
    throw new Error('Uploadcare public key is not configured');
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are allowed');
  }

  // Validate file size (10MB max)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error('Image must be less than 10MB');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('UPLOADCARE_PUB_KEY', publicKey);
  formData.append('UPLOADCARE_STORE', config?.store || 'auto');

  try {
    const response = await fetch('https://upload.uploadcare.com/base/', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Upload failed');
    }

    const data: UploadResponse = await response.json();
    
    // Use custom CDN domain instead of default
    const cdnDomain = config?.cdnDomain || UPLOADCARE_CDN_DOMAIN;
    return `${cdnDomain}/${data.file}/`;
  } catch (error) {
    console.error('Uploadcare upload error:', error);
    throw error;
  }
}

/**
 * Delete a file from Uploadcare
 * @param fileIdOrUrl - The file ID or full CDN URL
 * @param secretKey - Uploadcare secret key (required for deletion)
 * @returns Promise<void>
 */
export async function deleteFromUploadcare(
  fileIdOrUrl: string,
  secretKey?: string
): Promise<void> {
  const secret = secretKey || process.env.UPLOADCARE_SECRET_KEY;
  
  if (!secret) {
    throw new Error('Uploadcare secret key is required for deletion');
  }

  // Extract file ID from URL if full URL is provided
  const fileId = extractFileIdFromUrl(fileIdOrUrl);

  try {
    const response = await fetch(`https://api.uploadcare.com/files/${fileId}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Uploadcare.Simple ${process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY}:${secret}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Deletion failed');
    }
  } catch (error) {
    console.error('Uploadcare deletion error:', error);
    throw error;
  }
}

/**
 * Extract file ID from Uploadcare CDN URL
 * @param url - Full CDN URL or file ID
 * @returns The file ID
 */
export function extractFileIdFromUrl(url: string): string {
  // Check for both default and custom CDN domains
  if (!url.includes('ucarecdn.com') && !url.includes('ucarecd.net')) {
    // Assume it's already a file ID
    return url;
  }

  // Extract UUID from URL - works with both domains
  // Matches: https://ucarecdn.com/UUID/ or https://2l9nx4euxr.ucarecd.net/UUID/
  const matches = url.match(/\/([a-f0-9-]{36})\/?/i);
  if (matches && matches[1]) {
    return matches[1];
  }

  throw new Error('Invalid Uploadcare URL format');
}

/**
 * Normalize Uploadcare URL to use your custom CDN domain
 * @param url - Any Uploadcare URL
 * @returns Normalized URL with custom domain
 */
export function normalizeUploadcareUrl(url: string): string {
  if (!url || !isUploadcareUrl(url)) {
    return url;
  }

  const fileId = extractFileIdFromUrl(url);
  
  // Check if URL has transformations
  const transformMatch = url.match(/\/([a-f0-9-]{36})\/(.*)/i);
  const transformations = transformMatch && transformMatch[2] ? transformMatch[2] : '';
  
  return `${UPLOADCARE_CDN_DOMAIN}/${fileId}/${transformations}`;
}

/**
 * Get optimized image URL with transformations
 * @param url - Original Uploadcare CDN URL
 * @param options - Transformation options
 * @returns Optimized image URL
 */
export function getOptimizedImageUrl(
  url: string,
  options?: {
    width?: number;
    height?: number;
    quality?: 'normal' | 'better' | 'best' | 'lighter' | 'lightest';
    format?: 'auto' | 'jpeg' | 'png' | 'webp' | 'avif';
  }
): string {
  if (!url || !isUploadcareUrl(url)) {
    return url;
  }

  const fileId = extractFileIdFromUrl(url);
  const transformations: string[] = [];

  if (options?.width || options?.height) {
    const w = options.width || '';
    const h = options.height || '';
    transformations.push(`resize/${w}x${h}`);
  }

  if (options?.quality) {
    transformations.push(`quality/${options.quality}`);
  }

  if (options?.format) {
    transformations.push(`format/${options.format}`);
  }

  const transformString = transformations.length > 0 
    ? `-/${transformations.join('/')}/` 
    : '';

  return `${UPLOADCARE_CDN_DOMAIN}/${fileId}/${transformString}`;
}

/**
 * Validate if a URL is a valid Uploadcare URL
 * @param url - URL to validate
 * @returns boolean
 */
export function isUploadcareUrl(url: string): boolean {
  return url.includes('ucarecdn.com') || url.includes('ucarecd.net');
}