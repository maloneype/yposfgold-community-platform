import { useMutation, useAction } from "convex/react";
import { api } from "@/lib/convex";

/**
 * Handles file upload to Convex storage
 * @param file - The file to upload
 * @param options - Additional options for the upload
 * @returns A promise that resolves to the storage ID and extracted metadata
 */
export async function uploadFileToConvex(
  file: File,
  options: {
    generateUploadUrl: ReturnType<typeof useMutation<typeof api.photos.generateUploadUrl>>;
    storePhotoMetadata: ReturnType<typeof useMutation<typeof api.photos.storePhotoMetadata>>;
    extractMetadata: ReturnType<typeof useAction<typeof api.photos.extractMetadata>>;
    chapterId: string;
    userId: string;
    eventId?: string;
    onProgress?: (progress: number) => void;
  }
) {
  const { generateUploadUrl, storePhotoMetadata, extractMetadata, chapterId, userId, eventId, onProgress } = options;

  // Step 1: Generate an upload URL
  const uploadUrl = await generateUploadUrl();
  
  // Step 2: Upload the file
  const result = await uploadFile(file, uploadUrl, onProgress);
  
  // Step 3: Extract metadata from the uploaded photo
  const metadata = await extractMetadata({ storageId: result.storageId });
  
  // Step 4: Store the photo metadata in the database
  const photoId = await storePhotoMetadata({
    storageId: result.storageId,
    chapterId,
    metadata,
    eventId,
    uploadedBy: userId,
  });
  
  return {
    photoId,
    storageId: result.storageId,
    metadata,
  };
}

/**
 * Uploads a file to a pre-signed URL
 * @param file - The file to upload
 * @param uploadUrl - The pre-signed URL from Convex
 * @param onProgress - Optional callback for upload progress
 * @returns A promise that resolves to the storage ID
 */
async function uploadFile(
  file: File,
  uploadUrl: { url: string; storageId: string },
  onProgress?: (progress: number) => void
) {
  return new Promise<{ storageId: string }>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress(progress);
      }
    });
    
    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve({ storageId: uploadUrl.storageId });
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    });
    
    xhr.addEventListener("error", () => {
      reject(new Error("Upload failed due to a network error"));
    });
    
    xhr.open("POST", uploadUrl.url);
    xhr.send(file);
  });
}

/**
 * Checks if a file is an image
 * @param file - The file to check
 * @returns Whether the file is an image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}

/**
 * Validates an image file (type and size)
 * @param file - The file to validate
 * @param maxSizeMB - Maximum file size in MB (default: 5)
 * @returns An error message if invalid, or null if valid
 */
export function validateImageFile(file: File, maxSizeMB = 5): string | null {
  if (!isImageFile(file)) {
    return "File is not an image. Please upload an image file (JPEG, PNG, etc.)";
  }
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return `Image is too large. Maximum size is ${maxSizeMB}MB.`;
  }
  
  return null;
} 