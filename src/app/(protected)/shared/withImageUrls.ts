'use server'

import { GetImagesResponse } from '@awjh/home-automation-v2-api-models'
import isDirectImageUrl from '@utils/isDirectImageUrl'
import isImageFileKey from '@utils/isImageFileKey'
import getEndpoint from './getEndpoint'

const MAX_IMAGES_PER_REQUEST = 50

type ImageService = 'recipe' | 'record'

async function getImageUrlsForKeys(
    service: ImageService,
    filekeys: string[],
): Promise<GetImagesResponse['images']> {
    const callApiEndpoint = await getEndpoint({
        endpoint: '/images/{service}',
        method: 'get',
    })

    try {
        const { images } = await callApiEndpoint<GetImagesResponse>({
            pathParams: { service },
            queryParams: { filekeys },
        })

        return images
    } catch (error) {
        // Missing images fall back to a placeholder rather than failing the page
        console.error('Error fetching image URLs:', error)
        return {}
    }
}

// Swaps each item's image file key for a presigned URL the browser can load directly
export default async function withImageUrls<Item extends { image?: string }>(
    service: ImageService,
    items: Item[],
): Promise<Item[]> {
    const images = items
        .map(({ image }) => image)
        .filter((image): image is string => !!image && !isDirectImageUrl(image))
    const invalidFilekeys = images.filter((image) => !isImageFileKey(image))

    if (invalidFilekeys.length > 0) {
        console.warn('Skipping invalid image file keys:', invalidFilekeys)
    }

    const filekeys = [...new Set(images.filter(isImageFileKey))]

    const batches = Array.from(
        { length: Math.ceil(filekeys.length / MAX_IMAGES_PER_REQUEST) },
        (_, index) =>
            filekeys.slice(index * MAX_IMAGES_PER_REQUEST, (index + 1) * MAX_IMAGES_PER_REQUEST),
    )

    const imageUrls = Object.assign(
        {},
        ...(await Promise.all(batches.map((batch) => getImageUrlsForKeys(service, batch)))),
    ) as GetImagesResponse['images']

    return items.map((item) => ({
        ...item,
        image: item.image && !isDirectImageUrl(item.image) ? imageUrls[item.image] : item.image,
    }))
}
