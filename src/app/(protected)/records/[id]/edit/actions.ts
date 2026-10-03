'use server'

import { PutRecordBody, PutRecordResponse } from '@awjh/home-automation-v2-api-models'
import getEndpoint from '../../../shared/getEndpoint'

export async function editRecord(
    recordId: string,
    record: PutRecordBody,
): Promise<PutRecordResponse> {
    const callApiEndpoint = await getEndpoint({
        endpoint: `/records/{id}`,
        method: 'put',
    })

    try {
        return await callApiEndpoint<PutRecordResponse>({
            additionalHeaders: {
                'Content-Type': 'application/json',
            },
            pathParams: {
                id: recordId,
            },
            body: record,
        })
    } catch (error) {
        console.error('Error editing record:', error)
        throw new Error('Failed to edit record')
    }
}
