// Mirrors the backend's ImageFileKeySchema. The bulk images endpoint rejects the whole request if
// any key fails this, so keys that don't match (e.g. from legacy recipes) are left out up front.
export default function isImageFileKey(image: string): boolean {
    return /^[\w-]+\.(jpg|png|webp|gif)$/.test(image)
}
