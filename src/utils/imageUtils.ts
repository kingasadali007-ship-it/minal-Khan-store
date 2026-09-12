/**
 * Utilities for client-side image processing, compression, and preview.
 * Supports JPG, JPEG, PNG, WEBP from desktop, Android, and iOS cameras and galleries.
 */

export interface ProcessedImageResult {
  dataUrl: string;
  sizeBytes: number;
  width: number;
  height: number;
  format: string;
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: 'Only JPG, JPEG, PNG, and WEBP image files are supported.',
    };
  }

  // Max 10MB input before compression
  if (file.size > 10 * 1024 * 1024) {
    return {
      valid: false,
      error: 'Image file size should not exceed 10MB.',
    };
  }

  return { valid: true };
}

export async function processAndCompressImage(
  file: File,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.82
): Promise<ProcessedImageResult> {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error || 'Invalid image file.');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio preserved dimensions
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Failed to get canvas 2D context'));
          return;
        }

        // Draw with high smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Export as WebP or JPEG
        const outputFormat = 'image/webp';
        let dataUrl = canvas.toDataURL(outputFormat, quality);
        if (!dataUrl.startsWith('data:image/webp')) {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        // Estimate size
        const head = 'data:image/webp;base64,';
        const sizeBytes = Math.round(((dataUrl.length - head.length) * 3) / 4);

        resolve({
          dataUrl,
          sizeBytes,
          width,
          height,
          format: outputFormat,
        });
      };

      img.onerror = () => reject(new Error('Failed to load image for processing'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}
