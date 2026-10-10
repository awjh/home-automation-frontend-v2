'use server'

import { PostImageBody, PostImageResponse } from '@awjh/home-automation-v2-api-models'
import {
    ImageContentType,
    isSupportedImageContentType,
    UploadRecipeImageInput,
    UploadRecipeImageResponse,
} from '@defs/Image'
import getEndpoint from './getEndpoint'

const IMAGE_EXTENSION_BY_CONTENT_TYPE: Record<ImageContentType, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
}

function guessContentTypeFromUrl(url: string): ImageContentType | undefined {
    const extension = url.split('?')[0].split('.').pop()?.toLowerCase()

    switch (extension) {
        case 'jpg':
        case 'jpeg':
            return 'image/jpeg'
        case 'png':
            return 'image/png'
        case 'webp':
            return 'image/webp'
        case 'gif':
            return 'image/gif'
        default:
            return undefined
    }
}

async function downloadImage(
    url: string,
): Promise<{ data: Uint8Array; contentType: ImageContentType }> {
    const response = await fetch(url)

    if (!response.ok) {
        throw new Error(`Failed to download image from URL: ${url}`)
    }

    const headerContentType = response.headers.get('content-type')?.split(';')[0].trim()
    const contentType =
        (headerContentType && isSupportedImageContentType(headerContentType)
            ? headerContentType
            : undefined) ?? guessContentTypeFromUrl(url)

    if (!contentType) {
        throw new Error(`Unable to determine a supported image content type for: ${url}`)
    }

    return {
        data: new Uint8Array(await response.arrayBuffer()),
        contentType,
    }
}

async function requestImageUpload(
    service: 'recipe' | 'record',
    contentType: ImageContentType,
): Promise<PostImageResponse> {
    const callApiEndpoint = await getEndpoint({
        endpoint: '/images',
        method: 'post',
    })

    try {
        return await callApiEndpoint<PostImageResponse>({
            additionalHeaders: {
                'Content-Type': 'application/json',
            },
            body: {
                service,
                contentType,
            } satisfies PostImageBody,
        })
    } catch (error) {
        console.error(`Error requesting ${service} image upload URL:`, error)
        throw new Error(`Failed to prepare ${service} image upload`)
    }
}

export default async function uploadImage(
    service: 'recipe' | 'record',
    input: UploadRecipeImageInput,
): Promise<UploadRecipeImageResponse> {
    // Files are uploaded by the browser straight to S3, so only hand back the presigned POST
    if (input.source === 'file') {
        if (!isSupportedImageContentType(input.contentType)) {
            throw new Error(`Unsupported image content type: ${input.contentType}`)
        }

        const { url, fields, fileKey } = await requestImageUpload(service, input.contentType)

        return { key: fileKey, upload: { url, fields } }
    }

    // URLs are fetched here as the browser can't read most third-party images due to CORS
    const { data, contentType } = await downloadImage(input.url)
    const uploadDetails = await requestImageUpload(service, contentType)

    const formData = new FormData()

    Object.entries(uploadDetails.fields).forEach(([key, value]) => {
        formData.append(key, value)
    })

    formData.append(
        'file',
        new Blob([data as unknown as BlobPart], { type: contentType }),
        `upload.${IMAGE_EXTENSION_BY_CONTENT_TYPE[contentType]}`,
    )

    const uploadResponse = await fetch(uploadDetails.url, {
        method: 'POST',
        body: formData,
    })

    if (!uploadResponse.ok) {
        console.error(`Error uploading ${service} image:`, await uploadResponse.text())
        throw new Error(`Failed to upload ${service} image`)
    }

    return { key: uploadDetails.fileKey }
}
