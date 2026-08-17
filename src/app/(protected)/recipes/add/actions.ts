import {
    GetExtractedExternalRecipeBasicsResponse,
    PostCalculateCaloriesBody,
    PostCalculateCaloriesResponse,
    PostRecipeBody,
    PostRecipeResponse,
} from '@awjh/home-automation-v2-api-models'
import { Recipe } from '@awjh/home-automation-v2-api-models/recipes'
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

export async function addRecipe(recipe: PostRecipeBody): Promise<PostRecipeResponse> {
    const headers = await getAuthHeaders()

    const res = await fetch(`${process.env.API_BASE_URL!}/recipes`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipe),
    })

    if (!res.ok) {
        throw new Error('Failed to add recipe')
    }

    return res.json()
}

export async function calculateCalories({
    ingredients,
    produces,
}: {
    ingredients: PostCalculateCaloriesBody['ingredients']
    produces: Recipe['produces']
}): Promise<PostCalculateCaloriesResponse> {
    const headers = await getAuthHeaders()

    const res = await fetch(`${process.env.API_BASE_URL!}/recipes/calories/calculate`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ingredients,
            serves: 'serves' in produces ? produces.serves : 1,
        } satisfies PostCalculateCaloriesBody),
    })

    if (!res.ok) {
        throw new Error('Failed to calculate calories')
    }

    const data = await res.json()
    return data.calories
}

export async function extractRecipeFromOnlineSource(
    url: string,
): Promise<GetExtractedExternalRecipeBasicsResponse> {
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
