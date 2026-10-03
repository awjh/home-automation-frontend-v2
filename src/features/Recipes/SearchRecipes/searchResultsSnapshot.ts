import { GetRecipesResponse } from '@awjh/home-automation-v2-api-models'

const STORAGE_KEY = 'recipe-search-results'

// The loaded results of a search, saved when leaving for a recipe so going back can restore them
export interface SearchResultsSnapshot {
    search: string
    recipes: GetRecipesResponse
    hasNextPage: boolean
    scrollY: number
}

export function saveSearchResultsSnapshot(snapshot: SearchResultsSnapshot) {
    try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot))
    } catch {
        // Storage can be full or blocked, in which case going back just starts from the first page
    }
}

// Removes the snapshot as it is read so it is only restored once, on the return to the search
export function takeSearchResultsSnapshot(
    search: string,
    firstPageRecipes: GetRecipesResponse,
): SearchResultsSnapshot | undefined {
    try {
        const stored = sessionStorage.getItem(STORAGE_KEY)
        sessionStorage.removeItem(STORAGE_KEY)

        if (!stored) {
            return undefined
        }

        const snapshot: SearchResultsSnapshot = JSON.parse(stored)
        // Only restore when it is the same search and its results still start the same way
        const startsWithFirstPage = firstPageRecipes.every(
            (recipe, index) => snapshot.recipes[index]?.id === recipe.id,
        )

        return snapshot.search === search &&
            startsWithFirstPage &&
            snapshot.recipes.length > firstPageRecipes.length
            ? snapshot
            : undefined
    } catch {
        return undefined
    }
}
