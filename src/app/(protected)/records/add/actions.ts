'use server'

import {
    GetExternalRecordResponse,
    GetExternalRecordsResponse,
    PostRecordBody,
    PostRecordResponse,
} from '@awjh/home-automation-v2-api-models'
import { ExternalRecordSource } from '@defs/ExternalRecord'
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

async function fetchExternalRecord(
    release: ExternalRecordSource,
): Promise<GetExternalRecordResponse> {
    if (release.source === 'discogs') {
        const callApiEndpoint = await getEndpoint({
            endpoint: '/records/external/discogs/{discogsId}',
            method: 'get',
        })

        return callApiEndpoint<GetExternalRecordResponse>({
            pathParams: { discogsId: String(release.discogsId) },
        })
    }

    const callApiEndpoint = await getEndpoint({
        endpoint: '/records/external/musicbrainz/{musicBrainzId}',
        method: 'get',
    })

    return callApiEndpoint<GetExternalRecordResponse>({
        pathParams: { musicBrainzId: release.musicBrainzId },
    })
}

// Gets the full details of a release from the source the search found it in
export async function getExternalRecord(
    release: ExternalRecordSource,
): Promise<RecordLookupResult> {
    let details: GetExternalRecordResponse

    try {
        details = await fetchExternalRecord(release)
    } catch (error) {
        console.error(`Error fetching external record from ${release.source}:`, error)
        throw new Error('Failed to fetch record details')
    }

    // Only the fields the form uses, so the catalogue number entered is kept
    return {
        title: details.title,
        artists: details.artists,
        labels: details.labels,
        year: details.year,
        type: details.type,
        format: details.format,
        sides: details.sides,
        tags: details.tags,
        imageUrl: details.originalImageUrl,
    }
}
