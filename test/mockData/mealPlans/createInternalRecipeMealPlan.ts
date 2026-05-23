import { MealTime } from '@awjh/home-automation-v2-api-models/mealPlans'
import InternalMealPlan from './InternalMealPlan'
import createPostMealPlanFixture from './createPostMealPlanFixture'

export default function createInternalRecipeMealPlan(
    date: string,
    mealTime: MealTime,
    title: string,
    recipeId: string,
) {
    return createPostMealPlanFixture(InternalMealPlan, {
        date,
        mealTime,
        source: {
            recipeId,
        },
        title,
    })
}
