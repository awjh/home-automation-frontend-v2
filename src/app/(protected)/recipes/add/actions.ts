'use server'

import {
    GetExtractedExternalRecipeResponse,
    PostCalculateCaloriesBody,
    PostCalculateCaloriesResponse,
    PostRecipeBody,
    PostRecipeResponse,
} from '@awjh/home-automation-v2-api-models'
import { Recipe } from '@awjh/home-automation-v2-api-models/recipes'
import getEndpoint from '../../shared/getEndpoint'

export async function addRecipe(recipe: PostRecipeBody): Promise<PostRecipeResponse> {
    const callApiEndpoint = await getEndpoint({
        endpoint: `/recipes`,
        method: 'post',
    })

    try {
        const result = await callApiEndpoint<PostRecipeResponse>({
            additionalHeaders: {
                'Content-Type': 'application/json',
            },
            body: recipe,
        })
        return result
    } catch (error) {
        console.error('Error adding recipe:', error)
        throw new Error('Failed to add recipe')
    }
}

export async function calculateCalories({
    ingredients,
    produces,
}: {
    ingredients: PostCalculateCaloriesBody['ingredients']
    produces: Recipe['produces']
}): Promise<PostCalculateCaloriesResponse> {
    const callApiEndpoint = await getEndpoint({
        endpoint: `/recipes/calories/calculate`,
        method: 'post',
    })

    try {
        const result = await callApiEndpoint<PostCalculateCaloriesResponse>({
            additionalHeaders: {
                'Content-Type': 'application/json',
            },
            body: {
                ingredients,
                serves: 'serves' in produces ? produces.serves : 1,
            } satisfies PostCalculateCaloriesBody,
        })

        return result
    } catch (error) {
        console.error('Error calculating calories:', error)
        throw new Error('Failed to calculate calories')
    }
}

export async function extractRecipeFromOnlineSource(
    url: string,
): Promise<GetExtractedExternalRecipeResponse> {
    const callApiEndpoint = await getEndpoint({
        endpoint: `/recipes/external/extract`,
        method: 'get',
    })

    try {
        const result = await callApiEndpoint<GetExtractedExternalRecipeResponse>({
            queryParams: {
                url,
            },
        })

        return result
    } catch (error) {
        console.error('Error extracting recipe:', error)
        throw new Error('Failed to extract recipe')
    }
}
