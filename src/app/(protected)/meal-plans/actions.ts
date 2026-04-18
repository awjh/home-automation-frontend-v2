'use server'

import {
    DeleteMealPlanResponse,
    GetExtractedExternalRecipeResponse,
    GetMealPlansResponse,
    PostMealPlanBody,
    PostMealPlanResponse,
    PutMealPlanResponse,
} from '@awjh/home-automation-v2-api-models'
import MealPlan from '@defs/MealPlan'
import AddMealPlanFormValues from '@features/MealPlanner/AddMealPlan/AddMealPlanForm/defs/AddMealPlanFormValues'
import createMealPlanFromFormValues from '@features/MealPlanner/AddMealPlan/utils/createMealPlanFromFormValues'
import { formatDate } from '@utils/formatDate'
import { cookies } from 'next/headers'

async function getSessionJwt() {
    const cookieStore = await cookies()
    const sessionJwt = cookieStore.get('stytch_session_jwt')?.value

    if (!sessionJwt) {
        throw new Error('Not authenticated')
    }

    return sessionJwt
}

export async function getMealPlans(startDate: Date, endDate: Date): Promise<GetMealPlansResponse> {
    const sessionJwt = await getSessionJwt()

    const res = await fetch(
        `${process.env.API_BASE_URL!}/meal-plans?startDate=${formatDate(startDate)}&endDate=${formatDate(endDate)}`,
        {
            cache: 'no-store',
            headers: {
                Authorization: `Bearer ${sessionJwt}`,
                'x-api-key': process.env.API_KEY!,
            },
        },
    )

    if (!res.ok) {
        throw new Error('Failed to fetch meal plans')
    }

    return res.json()
}

export async function addMealPlan(
    date: string,
    values: AddMealPlanFormValues,
): Promise<PostMealPlanResponse> {
    const sessionJwt = await getSessionJwt()
    const mealPlan: PostMealPlanBody = createMealPlanFromFormValues(date, values)

    const res = await fetch(`${process.env.API_BASE_URL!}/meal-plans`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${sessionJwt}`,
            'Content-Type': 'application/json',
            'x-api-key': process.env.API_KEY!,
        },
        body: JSON.stringify(mealPlan),
    })

    if (!res.ok) {
        throw new Error('Failed to add meal plan')
    }

    return mealPlan
}

export async function updateMealPlan(
    existingMealPlan: MealPlan,
    values: AddMealPlanFormValues,
): Promise<PutMealPlanResponse> {
    const sessionJwt = await getSessionJwt()
    const mealPlan = createMealPlanFromFormValues(existingMealPlan.date, {
        ...values,
        mealTime: existingMealPlan.mealTime,
    })
    const mealPlanBody = {
        author: mealPlan.author,
        course: mealPlan.course,
        duration: mealPlan.duration,
        source: mealPlan.source,
        title: mealPlan.title,
    }

    const res = await fetch(
        `${process.env.API_BASE_URL!}/meal-plans/${encodeURIComponent(existingMealPlan.date)}/${encodeURIComponent(existingMealPlan.mealTime)}`,
        {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${sessionJwt}`,
                'Content-Type': 'application/json',
                'x-api-key': process.env.API_KEY!,
            },
            body: JSON.stringify(mealPlanBody),
        },
    )

    if (!res.ok) {
        throw new Error('Failed to update meal plan')
    }

    return {
        date: existingMealPlan.date,
        mealTime: existingMealPlan.mealTime,
    }
}

export async function extractTitleFromOnlineSource(
    url: string,
): Promise<GetExtractedExternalRecipeResponse> {
    const sessionJwt = await getSessionJwt()

    const res = await fetch(
        `${process.env.API_BASE_URL!}/recipes/external/extract?url=${encodeURIComponent(url)}`,
        {
            cache: 'no-store',
            headers: {
                Authorization: `Bearer ${sessionJwt}`,
                'x-api-key': process.env.API_KEY!,
            },
        },
    )

    if (!res.ok) {
        throw new Error('Failed to extract recipe details')
    }

    return res.json()
}

export async function deleteMealPlan(mealPlan: MealPlan): Promise<DeleteMealPlanResponse> {
    const sessionJwt = await getSessionJwt()

    const res = await fetch(
        `${process.env.API_BASE_URL!}/meal-plans/${encodeURIComponent(mealPlan.date)}/${encodeURIComponent(mealPlan.mealTime)}`,
        {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${sessionJwt}`,
                'x-api-key': process.env.API_KEY!,
            },
        },
    )

    if (!res.ok) {
        throw new Error('Failed to delete meal plan')
    }

    return {
        date: mealPlan.date,
        mealTime: mealPlan.mealTime,
    }
}
