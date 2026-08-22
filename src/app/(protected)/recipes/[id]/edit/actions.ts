'use server'

import { PutRecipeBody, PutRecipeResponse } from '@awjh/home-automation-v2-api-models'
import getEndpoint from '../../../shared/getEndpoint'

export async function editRecipe(
    recipeId: string,
    recipe: PutRecipeBody,
): Promise<PutRecipeResponse> {
    const callApiEndpoint = await getEndpoint({
        endpoint: `/recipes/{id}`,
        method: 'put',
    })

    try {
        const result = await callApiEndpoint<PutRecipeResponse>({
            additionalHeaders: {
                'Content-Type': 'application/json',
            },
            pathParams: {
                id: recipeId,
            },
            body: recipe,
        })

        return result
    } catch (error) {
        console.error('Error editing recipe:', error)
        throw new Error('Failed to edit recipe')
    }
}
