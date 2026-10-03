'use server'

import {
    GetExternalRecordResponse,
    GetExternalRecordsResponse,
    PostRecordBody,
    PostRecordResponse,
} from '@awjh/home-automation-v2-api-models'
import { UploadRecipeImageInput, UploadRecipeImageResponse } from '@defs/Image'
import { RecordLookupResult } from '@defs/RecordLookup'
import getEndpoint from '../../shared/getEndpoint'
import uploadImage from '../../shared/uploadImage'

export async function addRecord(record: PostRecordBody): Promise<PostRecordResponse> {
    const callApiEndpoint = await getEndpoint({
        endpoint: '/records',
        method: 'post',
    })

    try {
        return await callApiEndpoint<PostRecordResponse>({
            additionalHeaders: {
                'Content-Type': 'application/json',
            },
            body: record,
        })
    } catch (error) {
        console.error('Error adding record:', error)
        throw new Error('Failed to add record')
    }
}

export async function uploadRecordImage(
    input: UploadRecipeImageInput,
): Promise<UploadRecipeImageResponse> {
    return uploadImage('record', input)
}

export async function searchExternalRecords(catNo: string): Promise<GetExternalRecordsResponse> {
    const callApiEndpoint = await getEndpoint({
        endpoint: '/records/external/search',
        method: 'get',
    })

    try {
        return await callApiEndpoint<GetExternalRecordsResponse>({
            queryParams: { catNo },
        })
    } catch (error) {
        console.error('Error searching external records:', error)
        throw new Error('Failed to search for record')
    }
}

export async function getExternalRecord(musicBrainzId: string): Promise<RecordLookupResult> {
    const callApiEndpoint = await getEndpoint({
        endpoint: '/records/external/{musicBrainzId}',
        method: 'get',
    })

    let release: GetExternalRecordResponse

    try {
        release = await callApiEndpoint<GetExternalRecordResponse>({
            pathParams: { musicBrainzId },
        })
    } catch (error) {
        console.error('Error fetching external record:', error)
        throw new Error('Failed to fetch record details')
    }

    // Only the fields the form uses, so the catalogue number entered is kept
    return {
        title: release.title,
        artists: release.artists,
        labels: release.labels,
        year: release.year,
        type: release.type,
        format: release.format,
        sides: release.sides,
        tags: release.tags,
        imageUrl: release.originalImageUrl,
    }
}
