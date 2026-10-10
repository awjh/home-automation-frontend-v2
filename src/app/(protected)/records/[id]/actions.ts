'use server'

import {
    GetRecordResponse,
    PutRecordBody,
    PutRecordResponse,
} from '@awjh/home-automation-v2-api-models'
import getEndpoint from '../../shared/getEndpoint'
import getImageUrl from '../../shared/getImageUrl'

export async function getRecord(id: string): Promise<GetRecordResponse> {
    const callApiEndpoint = await getEndpoint({
        endpoint: `/records/{id}`,
        method: 'get',
    })

    try {
        return await callApiEndpoint<GetRecordResponse>({
            pathParams: {
                id,
            },
        })
    } catch (error) {
        console.error('Error fetching record:', error)
        throw new Error('Failed to fetch record')
    }
}

export async function getRecordImageUrl(imageId: string | undefined): Promise<string | undefined> {
    return getImageUrl('record', imageId)
}

export async function updateRecordImage(
    recordId: string,
    imageKey: string | undefined,
): Promise<string | undefined> {
    // PUT replaces the whole record, so re-fetch it rather than trusting the client's copy
    // whose image has already been swapped for a resolved URL.
    const { id, ...record } = await getRecord(recordId)

    const callApiEndpoint = await getEndpoint({
        endpoint: `/records/{id}`,
        method: 'put',
    })

    try {
        await callApiEndpoint<PutRecordResponse>({
            additionalHeaders: {
                'Content-Type': 'application/json',
            },
            pathParams: {
                id,
            },
            body: { ...record, image: imageKey } satisfies PutRecordBody,
        })
    } catch (error) {
        console.error('Error updating record image:', error)
        throw new Error('Failed to update record image')
    }

    return getRecordImageUrl(imageKey)
}
