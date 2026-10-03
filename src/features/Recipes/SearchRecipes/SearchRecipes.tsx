'use client'

import {
    GetRecipesQueryParameters,
    GetRecipesResponse,
    SearchDefs,
} from '@awjh/home-automation-v2-api-models'
import { RecipeTags } from '@awjh/home-automation-v2-api-models/recipes'
import RECIPE_SEARCH_PAGE_SIZE from '@constants/RecipeSearchPageSize'
import PagedSearch from '@organisms/PagedSearch/PagedSearch'
import SearchRecipeResults from './SearchRecipeResults/SearchRecipeResults'
import SearchRecipesFilters from './SearchRecipesFilters/SearchRecipesFilters'

export interface SearchRecipesFiltersProps {
    tags: RecipeTags
    filters: SearchDefs.RecipeFilters
    recipes: GetRecipesResponse
    loadNextRecipesPage: (
        previousRecipeId: NonNullable<GetRecipesQueryParameters['previousRecipeId']>,
    ) => Promise<GetRecipesResponse>
}

export default function SearchRecipes({
    tags,
    filters,
    recipes,
    loadNextRecipesPage,
}: SearchRecipesFiltersProps) {
    return (
        <PagedSearch
            itemName={'recipe'}
            resultHrefPrefix={'/recipes/'}
            pageSize={RECIPE_SEARCH_PAGE_SIZE}
            firstPage={recipes}
            loadNextPage={loadNextRecipesPage}
            renderResults={({ results, onLoadNextPage, isLoadingNextPage }) => (
                <SearchRecipeResults
                    recipes={results}
                    onLoadNextPage={onLoadNextPage}
                    isLoadingNextPage={isLoadingNextPage}
                />
            )}
            renderFilters={({ onApply, onCancel }) => (
                <SearchRecipesFilters
                    tags={tags}
                    filters={filters}
                    onApply={onApply}
                    onCancel={onCancel}
                />
            )}
        />
    )
}
