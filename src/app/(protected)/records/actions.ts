'use server'

import {
    GetRecordSearchFiltersResponse,
    GetRecordsQueryParameters,
    GetRecordsResponse,
} from '@awjh/home-automation-v2-api-models'
import getEndpoint from '../shared/getEndpoint'
import withImageUrls from '../shared/withImageUrls'

export async function getRecordSearchFilters(): Promise<GetRecordSearchFiltersResponse> {
    const callApiEndpoint = await getEndpoint({
        endpoint: '/records/search-filters',
        method: 'get',
    })

    try {
        return await callApiEndpoint<GetRecordSearchFiltersResponse>({})
    } catch (error) {
        console.error('Error fetching record search filters:', error)
        throw new Error('Failed to fetch record search filters')
    }
}

type PreviousRecordId = NonNullable<GetRecordsQueryParameters['previousRecordId']>

// The search as it appears in the page URL, with tags and filters still JSON-encoded
export type RecordSearchQuery = {
    [Key in Exclude<keyof GetRecordsQueryParameters, 'previousRecordId'>]?: string | string[]
}

// Omitting previousRecordId fetches the first page; otherwise the page after that record
export async function getRecords(
    searchQuery: RecordSearchQuery,
    previousRecordId?: PreviousRecordId,
): Promise<GetRecordsResponse> {
    const callApiEndpoint = await getEndpoint({
        endpoint: '/records',
        method: 'get',
    })

    try {
        return await callApiEndpoint<GetRecordsResponse>({
            queryParams: {
                ...searchQuery,
                ...(previousRecordId && { previousRecordId }),
            },
        })
    } catch (error) {
        console.error('Error fetching records:', error)
        throw new Error('Failed to fetch records')
    }
}

export async function getNextRecordsPage(
    searchQuery: RecordSearchQuery,
    previousRecordId: PreviousRecordId,
): Promise<GetRecordsResponse> {
    return withRecordImageUrls(await getRecords(searchQuery, previousRecordId))
}

export async function withRecordImageUrls(
    records: GetRecordsResponse,
): Promise<GetRecordsResponse> {
    return withImageUrls('record', records)
}
