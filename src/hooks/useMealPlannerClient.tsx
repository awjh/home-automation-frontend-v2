import { cookies } from 'next/headers'
import backendApi from '@constants/BackendApi'
import { PostMealPlanBody, PostMealPlanResponse } from '@awjh/home-automation-v2-api-models'
import { Course, MealTime } from '@awjh/home-automation-v2-api-models/mealPlans'

async function getSessionJwt(): Promise<string> {
    const cookieStore = await cookies()
    const sessionJwt = cookieStore.get('stytch_session_jwt')?.value

    if (!sessionJwt) {
        throw new Error('Not authenticated')
    }

    return sessionJwt
}

function getBaseUrl(): string {
    if (!process.env.API_BASE_URL) {
        throw new Error('API_BASE_URL is not defined')
    }

    return process.env.API_BASE_URL
}

async function getMealPlans({ startDate, endDate }: { startDate: string; endDate: string }) {
    const url = getBaseUrl()
    const endpointPath = '/meal-plans' satisfies keyof (typeof backendApi)['paths']

    const sessionJwt = await getSessionJwt()

    const res = await fetch(`${url}${endpointPath}?startDate=${startDate}&endDate=${endDate}`, {
        cache: 'no-store',
        headers: {
            Authorization: `Bearer ${sessionJwt}`,
            'x-api-key': process.env.API_KEY!,
        },
    })

    if (!res.ok) {
        throw new Error('Failed to fetch meal plans')
    }

    return res.json()
}

async function addMealPlan(mealPlan: PostMealPlanBody): Promise<PostMealPlanResponse> {
    const url = getBaseUrl()
    const endpointPath = '/meal-plans' satisfies keyof (typeof backendApi)['paths']

    const sessionJwt = await getSessionJwt()

    const res = await fetch(`${url}${endpointPath}`, {
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

type DeleteMealPlanParams = {
    date: string
    mealTime: MealTime
    course: Course
}

type DeleteEndpointPath =
    `/meal-plans/{${keyof Pick<DeleteMealPlanParams, 'date'>}}/{${keyof Pick<DeleteMealPlanParams, 'mealTime'>}}/{${keyof Pick<DeleteMealPlanParams, 'course'>}}`

async function deleteMealPlan(props: {
    date: string
    mealTime: MealTime
    course: Course
}): Promise<void> {
    const url = getBaseUrl()
    const endpointPath =
        `/meal-plans/{date}/{mealTime}/{course}` satisfies keyof (typeof backendApi)['paths'] &
            DeleteEndpointPath

    let formattedEndpointPath = endpointPath
    for (const [key, value] of Object.entries(props)) {
        formattedEndpointPath = formattedEndpointPath.replace(`{${key}}`, encodeURIComponent(value))
    }

    const sessionJwt = await getSessionJwt()

    const res = await fetch(`${url}${formattedEndpointPath}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${sessionJwt}`,
            'x-api-key': process.env.API_KEY!,
        },
    })

    if (!res.ok) {
        throw new Error('Failed to delete meal plan')
    }
}

export const useMealPlannerClient = () => {
    return {
        getMealPlans,
        addMealPlan,
        deleteMealPlan,
    }
}
