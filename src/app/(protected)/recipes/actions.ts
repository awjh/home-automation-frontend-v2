'use server'

import {
    GetRecipeSearchFiltersResponse,
    GetRecipesResponse,
} from '@awjh/home-automation-v2-api-models'
import getEndpoint from '../shared/getEndpoint'

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

export async function getRecipes(
    queryParams: Record<'keywords' | 'tags' | 'filters', string>,
): Promise<GetRecipesResponse> {
    const callApiEndpoint = await getEndpoint({
        endpoint: '/recipes',
        method: 'get',
    })

    try {
        const result = await callApiEndpoint<GetRecipesResponse>({
            queryParams,
        })

        return result
    } catch (error) {
        console.error('Error fetching recipes:', error)
        throw new Error('Failed to fetch recipes')
    }
}
