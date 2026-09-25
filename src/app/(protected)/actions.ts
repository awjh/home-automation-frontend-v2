'use server'

import { SourceType } from '@awjh/home-automation-v2-api-models/mealPlans'
import UpcomingMeal from '@features/Home/UpcomingMeals/defs/UpcomingMeal'
import { getMealPlans } from './meal-plans/actions'
import { getRecipe, getRecipeImageDataUrl } from './recipes/[id]/actions'

async function getInternalRecipeImage(recipeId: string): Promise<string | undefined> {
    try {
        const recipe = await getRecipe(recipeId)
        return await getRecipeImageDataUrl(recipe.image)
    } catch {
        // A missing image shouldn't stop the home page rendering; the card shows a fallback
        return undefined
    }
}

export async function getUpcomingMeals({
    startDate,
    endDate,
}: {
    startDate: Date
    endDate: Date
}): Promise<UpcomingMeal[]> {
    const mealPlans = await getMealPlans({ startDate, endDate })

    return Promise.all(
        mealPlans.map(async (mealPlan) =>
            mealPlan.source.type === SourceType.INTERNAL_RECIPE
                ? { ...mealPlan, image: await getInternalRecipeImage(mealPlan.source.recipeId) }
                : mealPlan,
        ),
    )
}
