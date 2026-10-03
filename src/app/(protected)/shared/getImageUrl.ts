'use server'

import { GetImageResponse } from '@awjh/home-automation-v2-api-models'
import isDirectImageUrl from '@utils/isDirectImageUrl'
import getEndpoint from './getEndpoint'

export default async function getImageUrl(
    service: 'recipe' | 'record',
    imageId: string | undefined,
): Promise<string | undefined> {
    if (!imageId) {
        return undefined
    }

    if (isDirectImageUrl(imageId)) {
        return imageId
    }

    const callApiEndpoint = await getEndpoint({
        endpoint: `/images/{service}/{filekey}`,
        method: 'get',
    })

    try {
        const { url } = await callApiEndpoint<GetImageResponse>({
            pathParams: {
                service,
                filekey: imageId,
            },
        })

        return url
    } catch (error) {
        console.error('Error fetching image URL:', error)
        return undefined
    }
}
