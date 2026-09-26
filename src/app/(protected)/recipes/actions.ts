'use server'

import {
    GetImagesResponse,
    GetRecipeSearchFiltersResponse,
    GetRecipesQueryParameters,
    GetRecipesResponse,
} from '@awjh/home-automation-v2-api-models'
import isDirectImageUrl from '@utils/isDirectImageUrl'
import getEndpoint from '../shared/getEndpoint'

const MAX_IMAGES_PER_REQUEST = 50

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

async function getRecipeImageUrlsForKeys(filekeys: string[]): Promise<GetImagesResponse['images']> {
    const callApiEndpoint = await getEndpoint({
        endpoint: '/images/{service}',
        method: 'get',
    })

    try {
        const { images } = await callApiEndpoint<GetImagesResponse>({
            pathParams: { service: 'recipe' },
            queryParams: { filekeys },
        })

        return images
    } catch (error) {
        // Missing images fall back to a placeholder rather than failing the page
        console.error('Error fetching image URLs:', error)
        return {}
    }
}

// Swaps each recipe's image file key for a presigned URL the browser can load directly
export async function withRecipeImageUrls(
    recipes: GetRecipesResponse,
): Promise<GetRecipesResponse> {
    const filekeys = [
        ...new Set(
            recipes
                .map(({ image }) => image)
                .filter((image): image is string => !!image && !isDirectImageUrl(image)),
        ),
    ]

    const batches = Array.from(
        { length: Math.ceil(filekeys.length / MAX_IMAGES_PER_REQUEST) },
        (_, index) =>
            filekeys.slice(index * MAX_IMAGES_PER_REQUEST, (index + 1) * MAX_IMAGES_PER_REQUEST),
    )

    const imageUrls = Object.assign(
        {},
        ...(await Promise.all(batches.map(getRecipeImageUrlsForKeys))),
    ) as GetImagesResponse['images']

    return recipes.map((recipe) => ({
        ...recipe,
        image:
            recipe.image && !isDirectImageUrl(recipe.image)
                ? imageUrls[recipe.image]
                : recipe.image,
    }))
}
