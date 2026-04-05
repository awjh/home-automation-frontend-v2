'use server'

import { GetMealPlansResponse } from '@awjh/home-automation-v2-api-models'
import { formatDate } from '@utils/formatDate'
import { cookies } from 'next/headers'

export async function getMealPlans(startDate: Date, endDate: Date): Promise<GetMealPlansResponse> {
    const cookieStore = await cookies()
    const sessionJwt = cookieStore.get('stytch_session_jwt')?.value

    if (!sessionJwt) {
        throw new Error('Not authenticated')
    }

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
