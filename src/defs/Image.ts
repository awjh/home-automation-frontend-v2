export const SUPPORTED_IMAGE_CONTENT_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
] as const

export type ImageContentType = (typeof SUPPORTED_IMAGE_CONTENT_TYPES)[number]

export function isSupportedImageContentType(value: string): value is ImageContentType {
    return (SUPPORTED_IMAGE_CONTENT_TYPES as readonly string[]).includes(value)
}

// Matches the content-length-range on the backend's presigned POST
export const MAX_IMAGE_UPLOAD_BYTES = 5 * 1024 * 1024

export type UploadRecipeImageInput =
    | { source: 'file'; contentType: ImageContentType }
    | { source: 'url'; url: string }

export type PresignedImageUpload = {
    url: string
    fields: Record<string, string>
}

export type UploadRecipeImageResponse = {
    key: string
    // Only set for file sources, which the browser uploads straight to S3
    upload?: PresignedImageUpload
}
