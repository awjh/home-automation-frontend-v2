import { PostRecipeBody } from '@awjh/home-automation-v2-api-models'
import { SourceType } from '@awjh/home-automation-v2-api-models/mealPlans'

export function buildBookRecipe(title: string): PostRecipeBody {
    return {
        title,
        originalSource: {
            type: SourceType.BOOK,
            title: 'Cypress Recipe Seed Book',
            page: 12,
        },
        authors: ['Andrew Hurt'],
        calories: 620,
        duration: {
            prepDuration: 20,
            cookingDuration: 25,
            standingTime: 0,
        },
        ingredients: [
            {
                ingredients: [
                    {
                        item: 'Pasta',
                        quantity: 500,
                        measure: 'g',
                    },
                ],
            },
        ],
        method: [
            {
                text: 'Cook the pasta and combine everything.',
                ingredients: [],
            },
        ],
        produces: {
            serves: 4,
        },
        tags: {
            cuisine: [],
            mealType: [],
            meat: [],
            dietary: [],
            occasion: [],
            equipment: [],
        },
    }
}
