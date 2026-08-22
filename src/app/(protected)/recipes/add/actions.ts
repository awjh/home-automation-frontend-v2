'use server'

import {
    GetExtractedExternalRecipeResponse,
    PostCalculateCaloriesBody,
    PostCalculateCaloriesResponse,
    PostRecipeBody,
    PostRecipeResponse,
    PostImageBody,
    PostImageResponse,
} from '@awjh/home-automation-v2-api-models'
import { Recipe } from '@awjh/home-automation-v2-api-models/recipes'
import {
    ImageContentType,
    isSupportedImageContentType,
    UploadRecipeImageInput,
    UploadRecipeImageResponse,
} from '@defs/Image'
import getEndpoint from '../../shared/getEndpoint'

export async function addRecipe(recipe: PostRecipeBody): Promise<PostRecipeResponse> {
    const callApiEndpoint = await getEndpoint({
        endpoint: `/recipes`,
        method: 'post',
    })

    try {
        const result = await callApiEndpoint<PostRecipeResponse>({
            additionalHeaders: {
                'Content-Type': 'application/json',
            },
            body: recipe,
        })
        return result
    } catch (error) {
        console.error('Error adding recipe:', error)
        throw new Error('Failed to add recipe')
    }
}

export async function calculateCalories({
    ingredients,
    produces,
}: {
    ingredients: PostCalculateCaloriesBody['ingredients']
    produces: Recipe['produces']
}): Promise<PostCalculateCaloriesResponse> {
    const callApiEndpoint = await getEndpoint({
        endpoint: `/recipes/calories/calculate`,
        method: 'post',
    })

    try {
        const result = await callApiEndpoint<PostCalculateCaloriesResponse>({
            additionalHeaders: {
                'Content-Type': 'application/json',
            },
            body: {
                ingredients,
                serves: 'serves' in produces ? produces.serves : 1,
            } satisfies PostCalculateCaloriesBody,
        })

        return result
    } catch (error) {
        console.error('Error calculating calories:', error)
        throw new Error('Failed to calculate calories')
    }
}

export async function extractRecipeFromOnlineSource(
    url: string,
): Promise<GetExtractedExternalRecipeResponse> {
    const callApiEndpoint = await getEndpoint({
        endpoint: `/recipes/external/extract`,
        method: 'get',
    })

    try {
        const result = await callApiEndpoint<GetExtractedExternalRecipeResponse>({
            queryParams: {
                url,
            },
        })

        return result
    } catch (error) {
        console.error('Error extracting recipe:', error)
        throw new Error('Failed to extract recipe')
    }
}

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

async function resolveImageData(
    input: UploadRecipeImageInput,
): Promise<{ data: Uint8Array; contentType: ImageContentType }> {
    if (input.source === 'file') {
        if (!isSupportedImageContentType(input.contentType)) {
            throw new Error(`Unsupported image content type: ${input.contentType}`)
        }

        return {
            data: new Uint8Array(Buffer.from(input.data, 'base64')),
            contentType: input.contentType,
        }
    }

    const response = await fetch(input.url)

    if (!response.ok) {
        throw new Error(`Failed to download image from URL: ${input.url}`)
    }

    const headerContentType = response.headers.get('content-type')?.split(';')[0].trim()
    const contentType =
        (headerContentType && isSupportedImageContentType(headerContentType)
            ? headerContentType
            : undefined) ?? guessContentTypeFromUrl(input.url)

    if (!contentType) {
        throw new Error(`Unable to determine a supported image content type for: ${input.url}`)
    }

    return {
        data: new Uint8Array(await response.arrayBuffer()),
        contentType,
    }
}

export async function uploadRecipeImage(
    input: UploadRecipeImageInput,
): Promise<UploadRecipeImageResponse> {
    const { data, contentType } = await resolveImageData(input)

    const callApiEndpoint = await getEndpoint({
        endpoint: '/images',
        method: 'post',
    })

    let uploadDetails: PostImageResponse

    try {
        uploadDetails = await callApiEndpoint<PostImageResponse>({
            additionalHeaders: {
                'Content-Type': 'application/json',
            },
            body: {
                service: 'recipe',
                contentType,
            } satisfies PostImageBody,
        })
    } catch (error) {
        console.error('Error requesting recipe image upload URL:', error)
        throw new Error('Failed to prepare recipe image upload')
    }

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
        console.error('Error uploading recipe image:', await uploadResponse.text())
        throw new Error('Failed to upload recipe image')
    }

    return { key: uploadDetails.fileKey }
}
