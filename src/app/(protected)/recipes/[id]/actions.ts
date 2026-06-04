'use server'

import {
    GetRecipeResponse,
    PostMealPlanBody,
    PostMealPlanResponse,
} from '@awjh/home-automation-v2-api-models'
import MealPlan from '@defs/MealPlan'
import AddMealPlanFormValues from '@features/MealPlanner/AddMealPlan/AddMealPlanForm/defs/AddMealPlanFormValues'
import createMealPlanFromFormValues from '@features/MealPlanner/AddMealPlan/utils/createMealPlanFromFormValues'
import { cookies } from 'next/headers'

async function getSessionJwt() {
    const cookieStore = await cookies()
    const sessionJwt = cookieStore.get('stytch_session_jwt')?.value

    if (!sessionJwt) {
        throw new Error('Not authenticated')
    }

    return sessionJwt
}

async function getAuthHeaders() {
    const sessionJwt = await getSessionJwt()

    return {
        Authorization: `Bearer ${sessionJwt}`,
        'x-api-key': process.env.API_KEY!,
    }
}

export async function getRecipe(id: string): Promise<GetRecipeResponse> {
    const headers = await getAuthHeaders()

    const res = await fetch(`${process.env.API_BASE_URL!}/recipes/${encodeURIComponent(id)}`, {
        cache: 'no-store',
        headers,
    })

    if (!res.ok) {
        throw new Error('Failed to fetch recipe')
    }

    return res.json()
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

    const headers = await getAuthHeaders()

    const res = await fetch(
        `${process.env.API_BASE_URL!}/images/recipe/${encodeURIComponent(imageId)}`,
        {
            cache: 'no-store',
            headers,
        },
    )

    if (!res.ok) {
        // Fallback to a public asset path when an image id is not available in backend storage.
        return `/${imageId}`
    }

    const imageBuffer = Buffer.from(await res.arrayBuffer())
    const contentType = res.headers.get('content-type') ?? 'image/jpeg'

    return `data:${contentType};base64,${imageBuffer.toString('base64')}`
}

export async function addMealPlanFromRecipePage(
    values: AddMealPlanFormValues,
): Promise<PostMealPlanResponse> {
    const headers = await getAuthHeaders()
    const mealPlan: PostMealPlanBody = createMealPlanFromFormValues(values)

    const res = await fetch(`${process.env.API_BASE_URL!}/meal-plans`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(mealPlan),
    })

    if (!res.ok) {
        throw new Error('Failed to add meal plan')
    }

    return mealPlan
}

export async function deleteMealPlanFromRecipePage(
    mealPlan: Pick<MealPlan, 'date' | 'mealTime' | 'course'>,
): Promise<Pick<MealPlan, 'date' | 'mealTime' | 'course'>> {
    const headers = await getAuthHeaders()

    const res = await fetch(
        `${process.env.API_BASE_URL!}/meal-plans/${encodeURIComponent(mealPlan.date)}/${encodeURIComponent(mealPlan.mealTime)}/${encodeURIComponent(mealPlan.course)}`,
        {
            method: 'DELETE',
            headers,
        },
    )

    if (!res.ok) {
        throw new Error('Failed to delete meal plan')
    }

    return {
        date: mealPlan.date,
        mealTime: mealPlan.mealTime,
        course: mealPlan.course,
    }
}
