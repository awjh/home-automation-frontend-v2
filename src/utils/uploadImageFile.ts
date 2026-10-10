import {
    isSupportedImageContentType,
    MAX_IMAGE_UPLOAD_BYTES,
    UploadRecipeImageInput,
    UploadRecipeImageResponse,
} from '@defs/Image'

// Uploads straight from the browser to S3 using a presigned POST, keeping large files
// out of the Next server action body.
export default async function uploadImageFile(
    file: File,
    requestUpload: (input: UploadRecipeImageInput) => Promise<UploadRecipeImageResponse>,
): Promise<string> {
    if (!isSupportedImageContentType(file.type)) {
        throw new Error(`Unsupported image content type: ${file.type}`)
    }

    if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
        throw new Error(`Image is larger than ${MAX_IMAGE_UPLOAD_BYTES / 1024 / 1024}MB`)
    }

    const { key, upload } = await requestUpload({ source: 'file', contentType: file.type })

    if (!upload) {
        throw new Error('No presigned upload returned for image file')
    }

    const formData = new FormData()

    Object.entries(upload.fields).forEach(([name, value]) => {
        formData.append(name, value)
    })

    // S3 ignores any fields after the file, so it must be appended last
    formData.append('file', file)

    const response = await fetch(upload.url, {
        method: 'POST',
        body: formData,
    })

    if (!response.ok) {
        console.error('Error uploading image:', await response.text())
        throw new Error('Failed to upload image')
    }

    return key
}
