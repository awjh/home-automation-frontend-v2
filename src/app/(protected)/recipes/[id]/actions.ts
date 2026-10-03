'use server'

import {
    DeleteMealPlanResponse,
    GetMealPlansResponse,
    GetRecipeResponse,
    PostMealPlanBody,
    PostMealPlanResponse,
} from '@awjh/home-automation-v2-api-models'
import { SourceType } from '@awjh/home-automation-v2-api-models/mealPlans'
import MealPlan from '@defs/MealPlan'
import AddMealPlanFormValues from '@features/MealPlanner/AddMealPlan/AddMealPlanForm/defs/AddMealPlanFormValues'
import createMealPlanFromFormValues from '@features/MealPlanner/AddMealPlan/utils/createMealPlanFromFormValues'
import { RecipeMealPlanDate } from '@features/Recipes/ViewRecipe/RecipeMealPlans/RecipeMealPlans'
import { formatDate } from '@utils/formatDate'
import getEndpoint from '../../shared/getEndpoint'
import getImageUrl from '../../shared/getImageUrl'

const RECIPE_FETCH_MAX_ATTEMPTS = 6
const RECIPE_FETCH_RETRY_DELAY_MS = 350

function wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function getRecipe(id: string): Promise<GetRecipeResponse> {
    const callApiEndpoint = await getEndpoint({
        endpoint: `/recipes/{id}`,
        method: 'get',
    })

    try {
        for (let attempt = 1; attempt <= RECIPE_FETCH_MAX_ATTEMPTS; attempt += 1) {
            try {
                const recipe = await callApiEndpoint<GetRecipeResponse>({
                    pathParams: {
                        id,
                    },
                })

                return recipe
            } catch (error) {
                if (attempt === RECIPE_FETCH_MAX_ATTEMPTS) {
                    throw error
                }

                await wait(RECIPE_FETCH_RETRY_DELAY_MS)
            }
        }

        throw new Error('Failed to fetch recipe')
    } catch (error) {
        console.error('Error fetching recipe:', error)
        throw new Error('Failed to fetch recipe')
    }
}

export async function getRecipeImageUrl(imageId: string | undefined): Promise<string | undefined> {
    return getImageUrl('recipe', imageId)
}

export async function getRecipeMealPlanDates(recipeId: string): Promise<RecipeMealPlanDate[]> {
    // RecipeMealPlans shows this week plus the following two, so fetch that window with a
    // day of slack either side as the server's timezone may differ from the browser's.
    const startDate = new Date()
    const daysSinceMonday = (startDate.getDay() + 6) % 7
    startDate.setDate(startDate.getDate() - daysSinceMonday - 1)

    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + 23)

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
            .filter(
                ({ source }) =>
                    source.type === SourceType.INTERNAL_RECIPE && source.recipeId === recipeId,
            )
            .map(({ date, mealTime, course }) => ({ date, mealTime, course }))
    } catch (error) {
        // Highlighting planned days is non-essential, so don't fail the whole recipe page.
        console.error('Error fetching recipe meal plans:', error)
        return []
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
