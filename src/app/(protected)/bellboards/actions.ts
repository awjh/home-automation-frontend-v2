'use server'

import {
    GetBellboardsResponse,
    PostBellboardRingBody,
    PostBellboardRingResponse,
} from '@awjh/home-automation-v2-api-models'
import getEndpoint from '../shared/getEndpoint'

export async function getBellboards(): Promise<GetBellboardsResponse> {
    const callApiEndpoint = await getEndpoint({
        endpoint: '/bellboards',
        method: 'get',
    })

    try {
        return await callApiEndpoint<GetBellboardsResponse>({})
    } catch (error) {
        console.error('Error fetching bellboards:', error)
        throw new Error('Failed to fetch bellboards')
    }
}

export async function ringBellboard(
    bellboardName: string,
    room: string,
): Promise<PostBellboardRingResponse> {
    const callApiEndpoint = await getEndpoint({
        endpoint: '/bellboard/{bellboardName}/ring',
        method: 'post',
    })

    try {
        return await callApiEndpoint<PostBellboardRingResponse>({
            pathParams: { bellboardName },
            additionalHeaders: {
                'Content-Type': 'application/json',
            },
            body: { room } satisfies PostBellboardRingBody,
        })
    } catch (error) {
        console.error('Error ringing bellboard:', error)
        throw new Error('Failed to ring bellboard')
    }
}
