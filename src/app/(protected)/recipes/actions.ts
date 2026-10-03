'use server'

import {
    GetRecipeSearchFiltersResponse,
    GetRecipesQueryParameters,
    GetRecipesResponse,
} from '@awjh/home-automation-v2-api-models'
import getEndpoint from '../shared/getEndpoint'
import withImageUrls from '../shared/withImageUrls'

export async function getRecipeSearchFilters(): Promise<GetRecipeSearchFiltersResponse> {
    const callApiEndpoint = await getEndpoint({
        endpoint: '/recipes/search-filters',
        method: 'get',
    })

    try {
        const result = await callApiEndpoint<GetRecipeSearchFiltersResponse>({})

        return result
    } catch (error) {
        console.error('Error fetching recipe search filters:', error)
        throw new Error('Failed to fetch recipe search filters')
    }
}

type PreviousRecipeId = NonNullable<GetRecipesQueryParameters['previousRecipeId']>

// The search as it appears in the page URL, with tags and filters still JSON-encoded
export type RecipeSearchQuery = {
    [Key in Exclude<keyof GetRecipesQueryParameters, 'previousRecipeId'>]?: string
}

// Omitting previousRecipeId fetches the first page; otherwise the page after that recipe
export async function getRecipes(
    searchQuery: RecipeSearchQuery,
    previousRecipeId?: PreviousRecipeId,
): Promise<GetRecipesResponse> {
    const callApiEndpoint = await getEndpoint({
        endpoint: '/recipes',
        method: 'get',
    })

    try {
        const result = await callApiEndpoint<GetRecipesResponse>({
            queryParams: {
                ...searchQuery,
                ...(previousRecipeId && { previousRecipeId }),
            },
        })

        return result
    } catch (error) {
        console.error('Error fetching recipes:', error)
        throw new Error('Failed to fetch recipes')
    }
}

export async function getNextRecipesPage(
    searchQuery: RecipeSearchQuery,
    previousRecipeId: PreviousRecipeId,
): Promise<GetRecipesResponse> {
    return withRecipeImageUrls(await getRecipes(searchQuery, previousRecipeId))
}

export async function withRecipeImageUrls(
    recipes: GetRecipesResponse,
): Promise<GetRecipesResponse> {
    return withImageUrls('recipe', recipes)
}
