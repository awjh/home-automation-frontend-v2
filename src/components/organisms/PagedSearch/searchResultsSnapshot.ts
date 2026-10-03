// The loaded results of a search, saved when leaving for a result so going back can restore them
export interface SearchResultsSnapshot<Result extends { id: string }> {
    search: string
    results: Result[]
    hasNextPage: boolean
    scrollY: number
}

export function saveSearchResultsSnapshot<Result extends { id: string }>(
    storageKey: string,
    snapshot: SearchResultsSnapshot<Result>,
) {
    try {
        sessionStorage.setItem(storageKey, JSON.stringify(snapshot))
    } catch {
        // Storage can be full or blocked, in which case going back just starts from the first page
    }
}

// Removes the snapshot as it is read so it is only restored once, on the return to the search
export function takeSearchResultsSnapshot<Result extends { id: string }>(
    storageKey: string,
    search: string,
    firstPage: Result[],
): SearchResultsSnapshot<Result> | undefined {
    try {
        const stored = sessionStorage.getItem(storageKey)
        sessionStorage.removeItem(storageKey)

        if (!stored) {
            return undefined
        }

        const snapshot: SearchResultsSnapshot<Result> = JSON.parse(stored)
        // Only restore when it is the same search and its results still start the same way
        const startsWithFirstPage = firstPage.every(
            (result, index) => snapshot.results[index]?.id === result.id,
        )

        return snapshot.search === search &&
            startsWithFirstPage &&
            snapshot.results.length > firstPage.length
            ? snapshot
            : undefined
    } catch {
        return undefined
    }
}
