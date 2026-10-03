'use server'

import { GetRecordResponse } from '@awjh/home-automation-v2-api-models'
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
