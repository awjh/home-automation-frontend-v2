'use server'

import {
    DeleteMealPlanResponse,
    GetExtractedExternalRecipeBasicsResponse,
    GetMealPlansResponse,
    GetRecipesResponse,
    PostMealPlanBody,
    PostMealPlanResponse,
    PutMealPlanBody,
    PutMealPlanResponse,
} from '@awjh/home-automation-v2-api-models'
import { RecipeTags } from '@awjh/home-automation-v2-api-models/recipes'
import MealPlan from '@defs/MealPlan'
import AddMealPlanFormValues from '@features/MealPlanner/AddMealPlan/AddMealPlanForm/defs/AddMealPlanFormValues'
import createMealPlanFromFormValues from '@features/MealPlanner/AddMealPlan/utils/createMealPlanFromFormValues'
import { formatDate } from '@utils/formatDate'
import getEndpoint from '../shared/getEndpoint'

export async function getMealPlans({ startDate, endDate }: { startDate: Date; endDate: Date }) {
    const callApiEndpoint = await getEndpoint({
        endpoint: '/meal-plans',
        method: 'get',
    })

    try {
        const mealPlans = await callApiEndpoint<GetMealPlansResponse>({
            queryParams: {
                startDate: formatDate(startDate),
                endDate: formatDate(endDate),
            },
        })

        return mealPlans
    } catch (error) {
        console.error('Error fetching meal plans:', error)
        throw new Error('Failed to fetch meal plans')
    }
}

export async function addMealPlan(values: AddMealPlanFormValues): Promise<PostMealPlanResponse> {
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

export async function updateMealPlan(
    existingMealPlan: MealPlan,
    values: AddMealPlanFormValues,
): Promise<PutMealPlanResponse> {
    const mealPlan = createMealPlanFromFormValues({
        ...values,
        mealTime: existingMealPlan.mealTime,
        course: existingMealPlan.course,
        mealDate: existingMealPlan.date,
    })
    const mealPlanBody: PutMealPlanBody = {
        author: mealPlan.author,
        course: mealPlan.course,
        duration: mealPlan.duration,
        source: mealPlan.source,
        title: mealPlan.title,
    }

    const callApiEndpoint = await getEndpoint({
        endpoint: `/meal-plans/{date}/{mealTime}/{course}`,
        method: 'put',
    })

    try {
        const result = await callApiEndpoint<PutMealPlanResponse>({
            pathParams: {
                date: existingMealPlan.date,
                mealTime: existingMealPlan.mealTime,
                course: existingMealPlan.course,
            },
            additionalHeaders: {
                'Content-Type': 'application/json',
            },
            body: mealPlanBody,
        })

        return result
    } catch (error) {
        console.error('Error updating meal plan:', error)
        throw new Error('Failed to update meal plan')
    }
}

export async function extractTitleFromOnlineSource(
    url: string,
): Promise<GetExtractedExternalRecipeBasicsResponse> {
    const callApiEndpoint = await getEndpoint({
        endpoint: '/recipes/external/extract/basics',
        method: 'get',
    })

    try {
        const result = await callApiEndpoint<GetExtractedExternalRecipeBasicsResponse>({
            queryParams: { url },
        })

        return result
    } catch (error) {
        console.error('Error extracting title from online source:', error)
        throw new Error('Failed to extract title from online source')
    }
}

export async function deleteMealPlan(mealPlan: MealPlan): Promise<DeleteMealPlanResponse> {
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

export async function searchInternalRecipes(keywords: string): Promise<GetRecipesResponse> {
    const callApiEndpoint = await getEndpoint({
        endpoint: '/recipes',
        method: 'get',
    })

    try {
        const result = await callApiEndpoint<GetRecipesResponse>({
            queryParams: {
                tags: JSON.stringify({
                    cuisine: [],
                    mealType: [],
                    meat: [],
                    dietary: [],
                    occasion: [],
                    equipment: [],
                } satisfies RecipeTags),
                filters: JSON.stringify({}),
                keywords,
            },
        })

        return result
    } catch (error) {
        console.error('Error searching internal recipes:', error)
        throw new Error('Failed to search internal recipes')
    }
}
