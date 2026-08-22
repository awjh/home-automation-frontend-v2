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

export type UploadRecipeImageInput =
    | { source: 'file'; contentType: ImageContentType; data: string }
    | { source: 'url'; url: string }

export type UploadRecipeImageResponse = {
    key: string
}
