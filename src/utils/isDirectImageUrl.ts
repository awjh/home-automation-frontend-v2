// Image values that are already loadable (local public assets or full URLs) rather than
// file keys that need exchanging for a presigned URL
export default function isDirectImageUrl(image: string): boolean {
    return image.startsWith('/') || image.startsWith('http://') || image.startsWith('https://')
}
