'use server'

import {
    DeleteMealPlanResponse,
    GetRecipeResponse,
    PostMealPlanBody,
    PostMealPlanResponse,
} from '@awjh/home-automation-v2-api-models'
import MealPlan from '@defs/MealPlan'
import AddMealPlanFormValues from '@features/MealPlanner/AddMealPlan/AddMealPlanForm/defs/AddMealPlanFormValues'
import createMealPlanFromFormValues from '@features/MealPlanner/AddMealPlan/utils/createMealPlanFromFormValues'
import getEndpoint from '../../shared/getEndpoint'

export async function getRecipe(id: string): Promise<GetRecipeResponse> {
    const callApiEndpoint = await getEndpoint({
        endpoint: `/recipes/{id}`,
        method: 'get',
    })

    try {
        const recipe = await callApiEndpoint<GetRecipeResponse>({
            pathParams: {
                id,
            },
        })

        return recipe
    } catch (error) {
        console.error('Error fetching recipe:', error)
        throw new Error('Failed to fetch recipe')
    }
}

export async function getRecipeImageDataUrl(
    imageId: string | undefined,
): Promise<string | undefined> {
    if (!imageId) {
        return undefined
    }

    // Allow direct image paths/URLs as-is (useful for local public assets).
    if (
        imageId.startsWith('/') ||
        imageId.startsWith('http://') ||
        imageId.startsWith('https://')
    ) {
        return imageId
    }

    const callApiEndpoint = await getEndpoint({
        endpoint: `/images/{service}/{filekey}`,
        method: 'get',
    })

    try {
        const imageDataUrl = await callApiEndpoint<string>({
            pathParams: {
                service: 'recipe',
                filekey: imageId,
            },
        })

        return imageDataUrl
    } catch (error) {
        console.error('Error fetching image:', error)
        throw new Error('Failed to fetch image')
    }
}

export async function addMealPlanFromRecipePage(
    values: AddMealPlanFormValues,
): Promise<PostMealPlanResponse> {
    const mealPlan: PostMealPlanBody = createMealPlanFromFormValues(values)

    const callApiEndpoint = await getEndpoint({
        endpoint: '/meal-plans',
        method: 'post',
    })

    try {
        await callApiEndpoint<PostMealPlanResponse>({
            additionalHeaders: {
                'Content-Type': 'application/json',
            },
            body: mealPlan,
        })
    } catch (error) {
        console.error('Error adding meal plan:', error)
        throw new Error('Failed to add meal plan')
    }

    return mealPlan
}

export async function deleteMealPlanFromRecipePage(
    mealPlan: Pick<MealPlan, 'date' | 'mealTime' | 'course'>,
): Promise<DeleteMealPlanResponse> {
    const callApiEndpoint = await getEndpoint({
        endpoint: `/meal-plans/{date}/{mealTime}/{course}`,
        method: 'delete',
    })

    try {
        const result = await callApiEndpoint<DeleteMealPlanResponse>({
            pathParams: {
                date: mealPlan.date,
                mealTime: mealPlan.mealTime,
                course: mealPlan.course,
            },
        })

        return result
    } catch (error) {
        console.error('Error deleting meal plan:', error)
        throw new Error('Failed to delete meal plan')
    }
}
