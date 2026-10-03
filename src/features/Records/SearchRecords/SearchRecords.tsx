'use client'

import {
    GetRecordsQueryParameters,
    GetRecordsResponse,
    RecordFilters,
} from '@awjh/home-automation-v2-api-models'
import { RecordTags } from '@awjh/home-automation-v2-api-models/records'
import RECORD_SEARCH_PAGE_SIZE from '@constants/RecordSearchPageSize'
import PagedSearch from '@organisms/PagedSearch/PagedSearch'
import SearchRecordResults from './SearchRecordResults/SearchRecordResults'
import SearchRecordsFilters from './SearchRecordsFilters/SearchRecordsFilters'

export interface SearchRecordsProps {
    tags: RecordTags
    filters: RecordFilters
    records: GetRecordsResponse
    loadNextRecordsPage: (
        previousRecordId: NonNullable<GetRecordsQueryParameters['previousRecordId']>,
    ) => Promise<GetRecordsResponse>
}

export default function SearchRecords({
    tags,
    filters,
    records,
    loadNextRecordsPage,
}: SearchRecordsProps) {
    return (
        <PagedSearch
            itemName={'record'}
            resultHrefPrefix={'/records/'}
            pageSize={RECORD_SEARCH_PAGE_SIZE}
            firstPage={records}
            loadNextPage={loadNextRecordsPage}
            renderResults={({ results, onLoadNextPage, isLoadingNextPage }) => (
                <SearchRecordResults
                    records={results}
                    onLoadNextPage={onLoadNextPage}
                    isLoadingNextPage={isLoadingNextPage}
                />
            )}
            renderFilters={({ onApply, onCancel }) => (
                <SearchRecordsFilters
                    tags={tags}
                    filters={filters}
                    onApply={onApply}
                    onCancel={onCancel}
                />
            )}
        />
    )
}
