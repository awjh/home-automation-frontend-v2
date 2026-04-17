'use server'

import {
    GetMealPlansResponse,
    PostMealPlanBody,
    PostMealPlanResponse,
} from '@awjh/home-automation-v2-api-models'
import AddMealPlanFormValues from '@features/AddMealPlan/AddMealPlanForm/defs/AddMealPlanFormValues'
import createMealPlanFromFormValues from '@features/AddMealPlan/utils/createMealPlanFromFormValues'
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

    return res.json()
}
