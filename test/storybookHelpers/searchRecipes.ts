import { GetRecipesResponse } from '@awjh/home-automation-v2-api-models'

const searchRecipes: (keywords: string) => Promise<GetRecipesResponse> = async (keywords) => {
    const recipes: GetRecipesResponse = [
        {
            id: 'e5f2a38d-3e4d-4d07-8de0-5ff7f0972b01',
            title: 'Spaghetti Bolognese',
            authors: ['Andrew Hurt'],
            calories: 620,
            duration: { prepDuration: 20, cookingDuration: 45, standingTime: 0 },
            produces: { serves: 4 },
            tags: {
                cuisine: [],
                mealType: [],
                meat: [],
                dietary: [],
                occasion: [],
                equipment: [],
            },
        },
        {
            id: 'a8980061-49f6-4470-afab-870d2cc85b7f',
            title: 'Spaghetti Carbonara',
            authors: ['Andrew Hurt'],
            calories: 540,
            duration: { prepDuration: 10, cookingDuration: 20, standingTime: 0 },
            produces: { serves: 4 },
            tags: {
                cuisine: [],
                mealType: [],
                meat: [],
                dietary: [],
                occasion: [],
                equipment: [],
            },
        },
        {
            id: 'ae2058df-9953-42b4-8ff1-a97489f07f74',
            title: 'Vegetable Lasagne',
            authors: ['Nigella Lawson'],
            calories: 480,
            duration: { prepDuration: 30, cookingDuration: 50, standingTime: 10 },
            produces: { serves: 6 },
            tags: {
                cuisine: [],
                mealType: [],
                meat: [],
                dietary: [],
                occasion: [],
                equipment: [],
            },
        },
        {
            id: 'd1cbbac8-5b9c-4e7c-9a0b-2c3f1e5a9c3f',
            title: 'Base curry sauce',
            authors: ['Dan Toomb'],
            calories: 200,
            duration: { prepDuration: 15, cookingDuration: 30, standingTime: 0 },
            produces: { quantity: 400, measure: 'g' },
            tags: {
                cuisine: [],
                mealType: [],
                meat: [],
                dietary: [],
                occasion: [],
                equipment: [],
            },
        },
    ]

    const normalizedKeywords = keywords.trim().toLowerCase()

    if (!normalizedKeywords) {
        return []
    }

    return recipes.filter((recipe) => {
        return [recipe.title, ...recipe.authors].some((value) =>
            value.toLowerCase().includes(normalizedKeywords),
        )
    })
}

export default searchRecipes
