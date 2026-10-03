import type { Metadata } from 'next'
import SearchRecordScreen from '@screens/SearchRecordScreen/SearchRecordScreen'
import {
    getNextRecordsPage,
    getRecords,
    getRecordSearchFilters,
    RecordSearchQuery,
    withRecordImageUrls,
} from './actions'

export const metadata: Metadata = {
    title: 'Search Records',
}

export default async function SearchRecords({
    searchParams,
}: {
    searchParams: Promise<Record<'keywords' | 'tags' | 'filters', string | string[]>>
}) {
    const { keywords, tags, filters } = await searchParams
    // Only the search itself is taken from the URL so a load always starts from the first page
    const searchQuery: RecordSearchQuery = Object.fromEntries(
        Object.entries({ keywords, tags, filters }).filter(([, value]) => value !== undefined),
    )

    const [recordSearchFilters, records] = await Promise.all([
        getRecordSearchFilters(),
        getRecords(searchQuery).then(withRecordImageUrls),
    ])

    return (
        <SearchRecordScreen
            tags={recordSearchFilters.tags}
            filters={recordSearchFilters.filters}
            records={records}
            loadNextRecordsPage={getNextRecordsPage.bind(null, searchQuery)}
        />
    )
}
